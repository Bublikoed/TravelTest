import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export type GeoItem = {
    id: string | number;
    name: string;
    type: 'country' | 'city' | 'hotel';
    countryId?: string;
    flag?: string;
};

// PricesMap тип з API readme
export type PriceOffer = {
    id: string; // UUID
    amount: number; // 1500–4000
    currency: 'usd';
    startDate: string;
    endDate: string;
    hotelID?: string;
};
export type PricesMap = Record<string, PriceOffer>;

export type FiltersState = {
    selectedGeo: GeoItem | null;
};

const initialState: FiltersState = {
    selectedGeo: null,
};

const filtersSlice = createSlice({
    name: 'filters',
    initialState,
    reducers: {
        setFilters: (_state, action: PayloadAction<FiltersState>) =>
            action.payload,
        updateFilter: <K extends keyof FiltersState>(
            state: FiltersState,
            action: PayloadAction<{ key: K; value: FiltersState[K] }>,
        ) => {
            const { key, value } = action.payload;

            state[key] = value as any;
        },
    },
});

export const { setFilters, updateFilter } = filtersSlice.actions;
export default filtersSlice.reducer;
