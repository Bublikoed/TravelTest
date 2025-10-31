import { ComponentType, useMemo } from 'react';
import {
    setFilters as setFiltersAction,
    updateFilter as updateFilterAction,
    type FiltersState as Filters,
    type GeoItem,
} from '../store/filtersSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';

// Types re-exported from Redux slice

interface WithFiltersProps {
    filters: Filters;
    setFilters: (filters: Filters) => void;
    updateFilter: <K extends keyof Filters>(key: K, value: Filters[K]) => void;
}

function withFilters<P extends object>(
    WrappedComponent: ComponentType<P & WithFiltersProps>,
): ComponentType<P> {
    function WithFiltersComponent(props: P) {
        const dispatch = useAppDispatch();
        const filters = useAppSelector((state) => state.filters);

        const setFilters = useMemo(
            () => (newFilters: Filters) => {
                dispatch(setFiltersAction(newFilters));
            },
            [dispatch],
        );

        const updateFilter = useMemo(
            () =>
                <K extends keyof Filters>(key: K, value: Filters[K]) => {
                    dispatch(
                        updateFilterAction({
                            key,
                            value,
                        }),
                    );
                },
            [dispatch],
        );

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
