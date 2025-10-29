import { useState } from 'react';
import withFilters, { WithFiltersProps } from '../../hocs/withFilters';
import withLoader from '../../hocs/withLoader';
import ContentStateBox from '../../templates/ContextStateBox';
import FormSearchGeo from './FormSearchGeo';
import './SearchTour.css';

type GeoItem = {
    id: string | number;
    name: string;
    type: 'country' | 'city' | 'hotel';
    countryId?: string;
    flag?: string;
};

function SearchTourPage({ filters, updateFilter }: WithFiltersProps) {
    // Локальний стейт для форми, який ініціалізується з filters
    const [defaultForm, setDefaultForm] = useState({
        selectedGeo: filters.selectedGeo,
    });

    const handleSetFields = (fields: { selectedGeo: GeoItem | null }) => {
        setDefaultForm(fields);
        // Оновлюємо фільтри в localStorage
        updateFilter('selectedGeo', fields.selectedGeo);
    };

    return (
        <div className="search-tour">
            <h1>Пошук турів</h1>
            <FormSearchGeo setFields={handleSetFields} fields={defaultForm} />

            <ContentStateBox>
                <div className="tours-list">Список турів</div>
            </ContentStateBox>
        </div>
    );
}

export default withLoader(withFilters(SearchTourPage), {
    ignoreQueries: ['searchGeo'], // Ігноруємо запити пошуку геолокації
});
