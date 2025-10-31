import { useQuery } from '@tanstack/react-query';
import { getSearchPrices, startSearchPrices } from '../../../../../api/api';
import type { PricesMap } from '../../../../../store/filtersSlice';

interface ErrorResponse {
    code: number;
    error: true;
    message: string;
    waitUntil?: string;
}

const fetchPrices = async (countryID: string): Promise<PricesMap> => {
    // Крок 1: Запускаємо пошук та отримуємо токен
    const startResponse = await startSearchPrices(countryID);

    if (!startResponse.ok) {
        const errorData: ErrorResponse = await startResponse.json();

        throw errorData;
    }

    const startResult = await startResponse.json();
    const { token, waitUntil } = startResult;

    // Крок 2: Отримуємо результати після очікування
    const getPricesWithRetry = async (
        searchToken: string,
        nextWaitUntil: string,
        retries = 2,
    ): Promise<PricesMap> => {
        // Очікуємо до waitUntil
        const waitTime = new Date(nextWaitUntil).getTime() - Date.now();

        if (waitTime > 0) {
            // eslint-disable-next-line no-promise-executor-return
            await new Promise<void>((resolve) => {
                setTimeout(() => {
                    resolve();
                }, waitTime);
            });
        }

        const getResponse = await getSearchPrices(searchToken);

        if (!getResponse.ok) {
            const errorData: ErrorResponse = await getResponse.json();

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

        const result = await getResponse.json();

        return result.prices;
    };

    return getPricesWithRetry(token, waitUntil);
};

export const useSearchPrices = (countryID: string | null) => {
    const query = useQuery<PricesMap, ErrorResponse>({
        queryKey: ['prices', countryID],
        queryFn: () => {
            if (!countryID) {
                throw new Error('Country ID is required');
            }

            return fetchPrices(countryID);
        },
        enabled: !!countryID,
        retry: false,
        staleTime: 5 * 60 * 1000, // 5 хвилин
        gcTime: 10 * 60 * 1000, // 10 хвилин
    });

    return {
        data: query.data,
        isLoading: query.isLoading,
        isFetching: query.isFetching,
        error: query.error,
        refetch: query.refetch,
    };
};
