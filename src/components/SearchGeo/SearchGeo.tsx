import { useQuery } from '@tanstack/react-query';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useEffect, useRef, useState } from 'react';
// eslint-disable-next-line import/no-unresolved
import { v4 as uuidv4 } from 'uuid';
import { searchGeo } from '../../api/api';
import { Button, Input } from '../../ui';
import './SearchGeo.css';

type GeoItem = {
    id: string | number;
    name: string;
    type: 'country' | 'city' | 'hotel';
    countryId?: string;
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
    const [selectedItem, setSelectedItem] = useState<GeoItem | null>(
        defaultValue || null,
    );
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [filterType, setFilterType] = useState<
        'all' | 'country' | 'city' | 'hotel'
    >('all');
    const dropdownRef = useRef<HTMLDivElement>(null);
    const parentRef = useRef<HTMLDivElement>(null);

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

    // Віртуалізатор для дропдауну
    const virtualizer = useVirtualizer({
        count: geoData?.length || 0,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 50, // Приблизна висота елемента
        overscan: 5, // Кількість елементів для рендерингу поза видимою областю
    });

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

    const handleInputFocus = () => {
        if (selectedItem) {
            setFilterType(selectedItem.type);
        } else {
            setFilterType('all');
        }
        setIsDropdownOpen(true);
    };

    const handleClear = () => {
        setInputValue('');
        setSelectedItem(null);
        setFilterType('all');
        setIsDropdownOpen(false);
        onChange(null);
    };

    const getItemIcon = (type: string) => {
        switch (type) {
            case 'country':
                return '🌍';
            case 'city':
                return '🏙️';
            case 'hotel':
                return '🏨';
            default:
                return '📍';
        }
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
                    {isDropdownOpen && (
                        <div className="dropdown">
                            {isLoading && (
                                <div className="dropdown-item dropdown-loading">
                                    Завантаження...
                                </div>
                            )}
                            {error && (
                                <div className="dropdown-item dropdown-error">
                                    Помилка завантаження
                                </div>
                            )}
                            {geoData && geoData.length > 0 && (
                                <div
                                    ref={parentRef}
                                    className="dropdown-virtual-container"
                                    style={{
                                        height: '200px', // Фіксована висота для скролу
                                        overflow: 'auto',
                                    }}
                                >
                                    <div
                                        style={{
                                            height: `${virtualizer.getTotalSize()}px`,
                                            width: '100%',
                                            position: 'relative',
                                        }}
                                    >
                                        {virtualizer
                                            .getVirtualItems()
                                            .map((virtualItem) => {
                                                const item =
                                                    geoData[virtualItem.index];
                                                const itemId =
                                                    item.id || uuidv4();

                                                return (
                                                    <div
                                                        key={itemId}
                                                        className="dropdown-item"
                                                        role="button"
                                                        tabIndex={0}
                                                        onClick={() =>
                                                            handleItemSelect(
                                                                item,
                                                            )
                                                        }
                                                        onKeyDown={() => {}}
                                                        style={{
                                                            position:
                                                                'absolute',
                                                            top: 0,
                                                            left: 0,
                                                            width: '100%',
                                                            height: `${virtualItem.size}px`,
                                                            transform: `translateY(${virtualItem.start}px)`,
                                                        }}
                                                    >
                                                        <div className="item-content">
                                                            <span className="item-icon">
                                                                {item.type ===
                                                                    'country' &&
                                                                item?.flag &&
                                                                item?.flag
                                                                    .length >
                                                                    0 ? (
                                                                    <img
                                                                        src={
                                                                            item.flag
                                                                        }
                                                                        alt={
                                                                            item.name
                                                                        }
                                                                        width={
                                                                            20
                                                                        }
                                                                        height={
                                                                            20
                                                                        }
                                                                    />
                                                                ) : (
                                                                    getItemIcon(
                                                                        item.type,
                                                                    )
                                                                )}
                                                            </span>
                                                            <span className="item-name">
                                                                {item.name}
                                                            </span>
                                                        </div>
                                                        <span className="item-type">
                                                            {(() => {
                                                                switch (
                                                                    item.type
                                                                ) {
                                                                    case 'country':
                                                                        return 'Країна';
                                                                    case 'city':
                                                                        return 'Місто';
                                                                    default:
                                                                        return 'Готель';
                                                                }
                                                            })()}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                    </div>
                                </div>
                            )}
                            {geoData &&
                                geoData.length === 0 &&
                                inputValue.length >= 1 &&
                                !isLoading && (
                                    <div className="dropdown-item dropdown-empty">
                                        Нічого не знайдено
                                    </div>
                                )}
                        </div>
                    )}
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
