import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import withFilters, { WithFiltersProps } from '../../hocs/withFilters';
import ContentStateBox from '../../templates/ContextStateBox';
import FormSearchGeo from './components/FormSearchGeo';
import ListTours from './components/ListTours';

import { getCountryId } from '../../utils/getCountryId';
import { useSearchPrices } from './components/ListTours/hook/UsePrices';
import './SearchTourPage.css';

type GeoItem = {
    id: string | number;
    name: string;
    type: 'country' | 'city' | 'hotel';
    countryId?: string;
    flag?: string;
};

function SearchTourPage({ filters, updateFilter }: WithFiltersProps) {
    const queryClient = useQueryClient();

    const [defaultForm, setDefaultForm] = useState<{
        selectedGeo: GeoItem | null;
    }>({
        selectedGeo: filters.selectedGeo ?? null,
    });

    const { StartSearchPrices, isLoading, data, error } = useSearchPrices();
    const countryId = getCountryId(defaultForm.selectedGeo);

    const handleSearch = async (id?: string | null) => {
        const targetId = id ?? countryId;

        if (!targetId) return;

        const cached = queryClient.getQueryData(['prices', targetId]);

        if (!cached) {
            await StartSearchPrices(targetId); // тільки якщо нема в кеші
        }
    };

    const handleSetFields = (fields: { selectedGeo: GeoItem | null }) => {
        setDefaultForm(fields);
        updateFilter('selectedGeo', fields.selectedGeo);

        const newCountryId = getCountryId(fields.selectedGeo);

        if (newCountryId) handleSearch(newCountryId);
    };

    useEffect(() => {
        if (data && countryId) {
            queryClient.setQueryData(['prices', countryId], data);
        }
    }, [data, countryId, queryClient]);

    useEffect(() => {
        if (countryId) handleSearch();
    }, [countryId]);

    return (
        <div className="search-tour">
            <h1>Пошук турів</h1>
            <FormSearchGeo setFields={handleSetFields} fields={defaultForm} />

            <ContentStateBox
                isLoading={isLoading}
                isError={!!error}
                statusCode={error?.code || 0}
                message={error?.message ?? null}
            >
                <ListTours />
            </ContentStateBox>
        </div>
    );
}

export default withFilters(SearchTourPage);
