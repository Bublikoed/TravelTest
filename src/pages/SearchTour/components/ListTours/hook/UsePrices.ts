import { useState } from 'react';
import { getSearchPrices, startSearchPrices } from '../../../../../api/api';

interface ErrorResponse {
    code: number;
    error: true;
    message: string;
    waitUntil?: string;
}

export const useSearchPrices = () => {
    const [data, setData] = useState<any>(null);
    const [error, setError] = useState<ErrorResponse | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [token, setToken] = useState<string | null>(null);
    const [waitUntil, setWaitUntil] = useState<string | null>(null);

    const parseError = async (err: unknown): Promise<ErrorResponse> => {
        if (err instanceof Response) {
            try {
                const json = await err.json();

                return {
                    code: json?.code ?? err.status ?? 500,
                    error: true,
                    message: json?.message ?? 'Unexpected error',
                    waitUntil: json?.waitUntil,
                };
            } catch {
                return {
                    code: err.status ?? 500,
                    error: true,
                    message: 'Unexpected error',
                };
            }
        }

        const anyErr: any = err;

        return {
            code: anyErr?.code ?? 500,
            error: true,
            message: anyErr?.message ?? 'Unexpected error',
            waitUntil: anyErr?.waitUntil,
        };
    };

    const StartSearchPrices = async (countryID: string | null) => {
        if (!countryID) {
            setError({
                code: 400,
                error: true,
                message: 'Country ID is required param.',
            });

            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await startSearchPrices(countryID);

            if (!response.ok) {
                const errorData: ErrorResponse = await response.json();

                throw errorData;
            }

            const result = await response.json();

            setToken(result.token);
            setWaitUntil(result.waitUntil);

            await GetSearchPrices(result.token, result.waitUntil);
        } catch (err) {
            const parsed = await parseError(err);

            setError(parsed);
            setIsLoading(false);
        }
    };

    const GetSearchPrices = async (
        searchToken: string,
        nextWaitUntil: string,
        retries = 2,
    ): Promise<void> => {
        const waitTime = new Date(nextWaitUntil).getTime() - Date.now();

        if (waitTime > 0) {
            // eslint-disable-next-line no-promise-executor-return
            await new Promise((res) => setTimeout(res, waitTime));
        }

        try {
            const response = await getSearchPrices(searchToken);

            if (!response.ok) {
                const errorData: ErrorResponse = await response.json();

                if (response.status === 425 && retries > 0) {
                    return GetSearchPrices(
                        searchToken,
                        errorData.waitUntil as string,
                        retries - 1,
                    );
                }

                throw errorData;
            }

            const result = await response.json();

            setData(result.prices);
        } catch (err) {
            const parsed = await parseError(err);

            setError(parsed);
        } finally {
            setIsLoading(false);
        }

        return undefined;
    };

    return { StartSearchPrices, isLoading, data, error, token, waitUntil };
};
