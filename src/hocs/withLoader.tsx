import { useQueryClient } from '@tanstack/react-query';
import { ComponentType, useEffect } from 'react';
import { useAppDispatch } from '../store/hooks';
import { setLoading } from '../store/loaderSlice';

interface WithLoaderProps {
    [key: string]: any;
}

interface WithLoaderOptions {
    ignoreQueries?: string[]; // Масив ключів запитів, які потрібно ігнорувати
    ignoreQueryPatterns?: RegExp[]; // Масив регулярних виразів для ігнорування запитів
}

function withLoader<P extends object>(
    WrappedComponent: ComponentType<P>,
    options?: WithLoaderOptions,
): ComponentType<P & WithLoaderProps> {
    function WithLoaderComponent(props: P & WithLoaderProps) {
        const queryClient = useQueryClient();
        const dispatch = useAppDispatch();

        useEffect(() => {
            // Функція для перевірки, чи потрібно ігнорувати запит
            const shouldIgnoreQuery = (
                queryKey: readonly unknown[],
            ): boolean => {
                if (!options) return false;

                const queryKeyString = JSON.stringify(queryKey);

                // Перевіряємо точні збіги
                if (
                    options.ignoreQueries?.some((ignoreKey) =>
                        queryKeyString.includes(ignoreKey),
                    )
                ) {
                    return true;
                }

                // Перевіряємо регулярні вирази
                if (
                    options.ignoreQueryPatterns?.some((pattern) =>
                        pattern.test(queryKeyString),
                    )
                ) {
                    return true;
                }

                return false;
            };

            const updateLoadingState = () => {
                const queries = queryClient.getQueryCache().getAll();
                const hasLoadingQueries = queries.some(
                    (query) =>
                        query.state.status === 'pending' &&
                        !shouldIgnoreQuery(query.queryKey),
                );

                dispatch(setLoading(hasLoadingQueries));
            };

            // Відстежуємо зміни в React Query
            const unsubscribe = queryClient
                .getQueryCache()
                .subscribe((event) => {
                    if (
                        event.type === 'added' ||
                        event.type === 'updated' ||
                        event.type === 'removed'
                    ) {
                        updateLoadingState();
                    }
                });

            // Перевіряємо поточний стан при монтуванні тільки якщо є запити
            const queries = queryClient.getQueryCache().getAll();

            if (queries.length > 0) {
                updateLoadingState();
            }

            return () => {
                unsubscribe();
            };
        }, [queryClient, dispatch]);

        // eslint-disable-next-line react/jsx-props-no-spreading
        return <WrappedComponent {...props} />;
    }

    WithLoaderComponent.displayName = `withLoader(${
        WrappedComponent.displayName || WrappedComponent.name
    })`;

    return WithLoaderComponent;
}

export default withLoader;
