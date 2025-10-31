import { useEffect, useState } from 'react';
import withFilters, { WithFiltersProps } from '../../hocs/withFilters';
import type { GeoItem } from '../../store/filtersSlice';
import ContentStateBox from '../../templates/ContextStateBox';
import FormSearchGeo from './components/FormSearchGeo';
import ListTours from './components/ListTours';

import { getCountryId } from '../../utils/getCountryId';
import { useSearchPrices } from './components/ListTours/hook/UsePrices';
import './SearchTourPage.css';

function SearchTourPage({ filters, updateFilter }: WithFiltersProps) {
    const [defaultForm, setDefaultForm] = useState<{
        selectedGeo: GeoItem | null;
    }>({
        selectedGeo: filters.selectedGeo ?? null,
    });

    const countryId = getCountryId(defaultForm.selectedGeo);
    const { isLoading, isFetching, error, isCancelling } =
        useSearchPrices(countryId);

    const handleSetFields = (fields: { selectedGeo: GeoItem | null }) => {
        setDefaultForm(fields);
        updateFilter('selectedGeo', fields.selectedGeo);
    };

    useEffect(() => {
        if (!filters.usdRate) {
            updateFilter('usdRate', 40);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const isProcessing = isLoading || isFetching || isCancelling;

    return (
        <div className="page-container search-tour">
            <h1>Пошук турів</h1>
            <FormSearchGeo setFields={handleSetFields} fields={defaultForm} />

            <ContentStateBox
                isLoading={isProcessing}
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
