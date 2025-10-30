import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { getCountries, searchGeo } from '../../api/api';
import { Button, Input } from '../../ui';
import GeoDropdown from '../GeoDropdown';
import './SearchGeo.css';

type GeoItem = {
    id: string | number;
    name: string;
    type: 'country' | 'city' | 'hotel';
    countryId?: string;
    flag?: string;
};

type CountryItem = {
    id: string | number;
    name: string;
    type: 'country';
    flag?: string;
};

function SerchGeo({
    onChange,
    defaultValue,
}: {
    onChange: (value: GeoItem | null) => void;
    defaultValue?: GeoItem | null;
}) {
    const [inputValue, setInputValue] = useState(defaultValue?.name || '');
    const [countriesData, setCountriesData] = useState<GeoItem[]>([]);
    const [selectedItem, setSelectedItem] = useState<GeoItem | null>(
        defaultValue || null,
    );
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [filterType, setFilterType] = useState<
        'all' | 'country' | 'city' | 'hotel'
    >('all');
    const dropdownRef = useRef<HTMLDivElement>(null);

    const {
        data: geoData,
        error,
        isLoading,
    } = useQuery({
        queryKey: ['searchGeo', inputValue, filterType],
        queryFn: async () => {
            try {
                const response = await searchGeo(inputValue);
                const data = await response.json();

                // Convert the object to an array for easier mapping
                const allData = Object.values(data) as GeoItem[];

                // Filter by type if needed
                if (filterType !== 'all') {
                    return allData.filter((item) => item.type === filterType);
                }

                return allData;
            } catch (err) {
                console.error('Error fetching geo data:', err);

                return [];
            }
        },
        enabled:
            isDropdownOpen &&
            (inputValue.length >= 1 || inputValue.length === 0),
    });

    const listToShow = countriesData.length > 0 ? countriesData : geoData || [];

    // Синхронізуємо з defaultValue при зміні
    useEffect(() => {
        if (defaultValue) {
            setInputValue(defaultValue.name);
            setSelectedItem(defaultValue);
            setFilterType(defaultValue.type);
        } else {
            setInputValue('');
            setSelectedItem(null);
            setFilterType('all');
        }
    }, [defaultValue]);

    // Закриваємо дропдаун при кліку поза ним
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleInputChange = (value: string) => {
        setInputValue(value);
        setSelectedItem(null);
        setFilterType('all');
        setIsDropdownOpen(true);
    };
    const handleItemSelect = (item: GeoItem) => {
        setSelectedItem(item);
        setInputValue(item.name);
        setFilterType(item.type);
        setIsDropdownOpen(false);
    };
    const handleInputFocus = async () => {
        if (selectedItem?.type === 'country') {
            try {
                const res = await getCountries();
                const json = await res.json();
                const list = Object.values(json).map((item) => ({
                    ...(item as CountryItem),
                    type: 'country',
                })) as GeoItem[];

                setCountriesData(list);
                setFilterType('country');
            } catch (err) {
                console.error('Не вдалося завантажити країни', err);
                setCountriesData([]);
            }
        }

        setIsDropdownOpen(true);
    };
    const handleClear = () => {
        setInputValue('');
        setSelectedItem(null);
        setFilterType('all');
        setIsDropdownOpen(false);
        setCountriesData([]);
    };

    return (
        <div className="search-geo-container">
            <div className="search-inputs">
                <div className="search-field" ref={dropdownRef}>
                    <div className="input-with-clear">
                        <Input
                            placeholder="Введіть назву міста, країни або готель"
                            size="large"
                            variant="outlined"
                            value={inputValue}
                            onChange={handleInputChange}
                            onFocus={handleInputFocus}
                        />
                        {inputValue && (
                            <button
                                type="button"
                                className="clear-button"
                                onClick={handleClear}
                                aria-label="Очистити поле"
                            >
                                ✕
                            </button>
                        )}
                    </div>
                    <GeoDropdown
                        isOpen={isDropdownOpen}
                        isLoading={!!isLoading}
                        error={error}
                        items={listToShow}
                        showEmpty={Boolean(
                            geoData &&
                                geoData.length === 0 &&
                                inputValue.length >= 1 &&
                                !isLoading,
                        )}
                        onSelect={handleItemSelect}
                    />
                </div>
            </div>
            <Button
                variant="primary"
                size="large"
                onClick={() => onChange(selectedItem)}
            >
                🔍 Пошук турів
            </Button>
        </div>
    );
}

export default SerchGeo;
