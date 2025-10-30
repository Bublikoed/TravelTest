import { configureStore } from '@reduxjs/toolkit';
import filtersReducer, { FiltersState } from './filtersSlice';

const FILTERS_STORAGE_KEY = 'travel_filters';

function loadFiltersFromStorage(): FiltersState | undefined {
    try {
        const raw = localStorage.getItem(FILTERS_STORAGE_KEY);

        if (!raw) return undefined;
        const parsed = JSON.parse(raw);

        if (parsed && typeof parsed === 'object') {
            return parsed as FiltersState;
        }

        return undefined;
    } catch {
        return undefined;
    }
}

export const store = configureStore({
    reducer: {
        filters: filtersReducer,
    },
    preloadedState: {
        filters: loadFiltersFromStorage() ?? { selectedGeo: null },
    },
});

store.subscribe(() => {
    try {
        const state = store.getState();
        const filters = state.filters as FiltersState;

        localStorage.setItem(FILTERS_STORAGE_KEY, JSON.stringify(filters));
    } catch {
        // ignore
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
