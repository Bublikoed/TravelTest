import SearchGeo from '../../../../components/SearchGeo';
import './FormSearchGeo.css';

type GeoItem = {
    id: string | number;
    name: string;
    type: 'country' | 'city' | 'hotel';
    countryId?: string;
    flag?: string;
};

type FormSearchProps = {
    setFields: (fields: any) => void;
    fields: any;
};

function FormSearchGeo({ fields, setFields }: FormSearchProps) {
    const setValue = (value: GeoItem | null) => {
        setFields({ ...fields, selectedGeo: value });
    };

    return (
        <div>
            <div className="search-form">
                <SearchGeo
                    onChange={setValue}
                    defaultValue={fields.selectedGeo}
                />
            </div>
        </div>
    );
}

export default FormSearchGeo;
