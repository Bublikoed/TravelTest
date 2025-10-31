import SearchGeo from '../../../../components/SearchGeo';
import type { GeoItem } from '../../../../store/filtersSlice';
import './FormSearchGeo.css';

type FormSearchFields = {
    selectedGeo: GeoItem | null;
};

type FormSearchProps = {
    setFields: (fields: FormSearchFields) => void;
    fields: FormSearchFields;
};

function FormSearchGeo({ fields, setFields }: FormSearchProps) {
    const setValue = (value: GeoItem | null) => {
        setFields({ ...fields, selectedGeo: value });
    };

    return (
        <div>
            <div className="search-form">
                <SearchGeo
                    onSearch={setValue}
                    defaultValue={fields.selectedGeo}
                />
            </div>
        </div>
    );
}

export default FormSearchGeo;
