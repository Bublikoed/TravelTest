import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useRef } from 'react';
import {
    getSearchPrices,
    startSearchPrices,
    stopSearchPrices,
} from '../../../../../api/api';
import type { PricesMap } from '../../../../../store/filtersSlice';

interface ErrorResponse {
    code: number;
    error: true;
    message: string;
    waitUntil?: string;
}

const fetchPrices = async (
    countryID: string,
    activeTokenRef: React.MutableRefObject<string | null>,
): Promise<PricesMap> => {
    // Крок 1: Запускаємо пошук та отримуємо токен
    const startResponse = await startSearchPrices(countryID);

    if (!startResponse.ok) {
        const errorData: ErrorResponse = await startResponse.json();

        throw errorData;
    }

    const startResult = await startResponse.json();
    const { token, waitUntil } = startResult;

    // Зберігаємо токен для подальшої перевірки
    activeTokenRef.current = token;

    // Крок 2: Отримуємо результати після очікування
    const getPricesWithRetry = async (
        searchToken: string,
        nextWaitUntil: string,
        retries = 2,
    ): Promise<PricesMap> => {
        // Перевірка race condition - якщо токен змінився, ігноруємо цей запит
        if (activeTokenRef.current !== searchToken) {
            throw new Error('Search was cancelled');
        }

        // Очікуємо до waitUntil
        const waitTime = new Date(nextWaitUntil).getTime() - Date.now();

        if (waitTime > 0) {
            // eslint-disable-next-line no-promise-executor-return
            await new Promise<void>((resolve) => {
                setTimeout(() => {
                    // Перевірка перед резолвом - якщо токен змінився, не резолвимо
                    if (activeTokenRef.current === searchToken) {
                        resolve();
                    }
                }, waitTime);
            });
        }

        // Фінальна перевірка перед запитом
        if (activeTokenRef.current !== searchToken) {
            throw new Error('Search was cancelled');
        }

        const getResponse = await getSearchPrices(searchToken);

        if (!getResponse.ok) {
            const errorData: ErrorResponse = await getResponse.json();

            // Перевірка race condition перед обробкою помилки
            if (activeTokenRef.current !== searchToken) {
                throw new Error('Search was cancelled');
            }

            // Якщо 425 (Too Early) та є retries, повторюємо
            if (
                getResponse.status === 425 &&
                retries > 0 &&
                errorData.waitUntil
            ) {
                return getPricesWithRetry(
                    searchToken,
                    errorData.waitUntil,
                    retries - 1,
                );
            }

            throw errorData;
        }

        // Фінальна перевірка перед поверненням результатів
        if (activeTokenRef.current !== searchToken) {
            throw new Error('Search was cancelled');
        }

        const result = await getResponse.json();

        return result.prices;
    };

    return getPricesWithRetry(token, waitUntil);
};

export const useSearchPrices = (countryID: string | null) => {
    const queryClient = useQueryClient();
    const activeTokenRef = useRef<string | null>(null);
    const isCancellingRef = useRef<boolean>(false);
    const prevCountryIDRef = useRef<string | null>(null);

    const cancelSearch = useCallback(async () => {
        const currentToken = activeTokenRef.current;

        if (!currentToken) {
            return;
        }

        isCancellingRef.current = true;

        try {
            await stopSearchPrices(currentToken);
        } catch (err) {
            // Ігноруємо помилки скасування (наприклад, якщо пошук вже завершився)
            console.warn('Failed to cancel search:', err);
        } finally {
            // Очищаємо токен та скидаємо флаг
            activeTokenRef.current = null;
            isCancellingRef.current = false;

            // Скасовуємо активний запит
            await queryClient.cancelQueries({
                queryKey: ['prices', prevCountryIDRef.current],
            });
        }
    }, [queryClient]);

    // Відстежуємо зміну countryID та скасовуємо старий пошук
    useEffect(() => {
        const prevCountryID = prevCountryIDRef.current;
        const currentCountryID = countryID;

        // Якщо countryID змінився та є попередній пошук
        if (
            prevCountryID &&
            currentCountryID &&
            prevCountryID !== currentCountryID &&
            activeTokenRef.current
        ) {
            // Скасовуємо попередній пошук перед запуском нового
            cancelSearch().then(() => {
                // Після скасування скасовуємо запити та очищаємо кеш
                queryClient.cancelQueries({
                    queryKey: ['prices', prevCountryID],
                });
            });
        }

        // Оновлюємо попереднє значення
        prevCountryIDRef.current = currentCountryID;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [countryID]);

    const query = useQuery<PricesMap, ErrorResponse>({
        queryKey: ['prices', countryID],
        queryFn: () => {
            if (!countryID) {
                throw new Error('Country ID is required');
            }

            return fetchPrices(countryID, activeTokenRef);
        },
        enabled: !!countryID,
        retry: false,
        staleTime: 5 * 60 * 1000, // 5 хвилин
        gcTime: 10 * 60 * 1000, // 10 хвилин
    });

    const refetchWithCancel = useCallback(async () => {
        // Скасовуємо поточний пошук якщо він активний
        if (activeTokenRef.current) {
            await cancelSearch();
        }

        // Очищаємо кеш та перезапускаємо
        queryClient.invalidateQueries({
            queryKey: ['prices', countryID],
        });

        return query.refetch();
    }, [countryID, cancelSearch, query, queryClient]);

    return {
        data: query.data,
        isLoading: query.isLoading || isCancellingRef.current,
        isFetching: query.isFetching,
        error: query.error,
        refetch: refetchWithCancel,
        cancelSearch,
        activeToken: activeTokenRef.current,
        isCancelling: isCancellingRef.current,
    };
};
