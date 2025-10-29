import { ComponentType, useEffect, useState } from 'react';

type GeoItem = {
    id: string | number;
    name: string;
    type: 'country' | 'city' | 'hotel';
    countryId?: string;
    flag?: string;
};

type Filters = {
    selectedGeo: GeoItem | null;
};

interface WithFiltersProps {
    filters: Filters;
    setFilters: (filters: Filters) => void;
    updateFilter: (key: keyof Filters, value: any) => void;
}

const FILTERS_STORAGE_KEY = 'travel_filters';

function withFilters<P extends object>(
    WrappedComponent: ComponentType<P & WithFiltersProps>,
): ComponentType<P> {
    function WithFiltersComponent(props: P) {
        const [filters, setFiltersState] = useState<Filters>(() => {
            try {
                const savedFilters = localStorage.getItem(FILTERS_STORAGE_KEY);

                if (savedFilters) {
                    return JSON.parse(savedFilters);
                }
            } catch (error) {
                console.warn(
                    'Failed to parse filters from localStorage:',
                    error,
                );
            }

            return {
                selectedGeo: null,
            };
        });

        const setFilters = (newFilters: Filters) => {
            setFiltersState(newFilters);

            try {
                localStorage.setItem(
                    FILTERS_STORAGE_KEY,
                    JSON.stringify(newFilters),
                );
            } catch (error) {
                console.warn('Failed to save filters to localStorage:', error);
            }
        };

        const updateFilter = (key: keyof Filters, value: any) => {
            const newFilters = { ...filters, [key]: value };

            setFilters(newFilters);
        };

        // Синхронізація з localStorage при зміні в іншій вкладці
        useEffect(() => {
            const handleStorageChange = (e: StorageEvent) => {
                if (e.key === FILTERS_STORAGE_KEY && e.newValue) {
                    try {
                        const newFilters = JSON.parse(e.newValue);

                        setFiltersState(newFilters);
                    } catch (error) {
                        console.warn(
                            'Failed to parse filters from storage event:',
                            error,
                        );
                    }
                }
            };

            window.addEventListener('storage', handleStorageChange);

            return () =>
                window.removeEventListener('storage', handleStorageChange);
        }, []);

        return (
            <WrappedComponent
                {...props}
                filters={filters}
                setFilters={setFilters}
                updateFilter={updateFilter}
            />
        );
    }

    WithFiltersComponent.displayName = `withFilters(${
        WrappedComponent.displayName || WrappedComponent.name
    })`;

    return WithFiltersComponent;
}

export default withFilters;
export type { Filters, GeoItem, WithFiltersProps };
