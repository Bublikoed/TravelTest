import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface LoaderState {
    isLoading: boolean;
}

const initialState: LoaderState = {
    isLoading: false,
};

const loaderSlice = createSlice({
    name: 'loader',
    initialState,
    reducers: {
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        startLoading: (state) => {
            state.isLoading = true;
        },
        stopLoading: (state) => {
            state.isLoading = false;
        },
    },
});

export const { setLoading, startLoading, stopLoading } = loaderSlice.actions;
export default loaderSlice.reducer;
