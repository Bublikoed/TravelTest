import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Provider } from 'react-redux';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import { Loader } from './components/Loader';
import Main from './main';
import DetailTourPage from './pages/DetailTour';
import SearchTourPage from './pages/SearchTour';
import { store } from './store';
import { useAppSelector } from './store/hooks';

function AppContent() {
    const isLoading = useAppSelector((state) => state.loader.isLoading);

    return (
        <>
            <Loader isLoading={isLoading} />
            <Main>
                <Routes>
                    <Route path="/" element={<SearchTourPage />} />
                    <Route path="/detail-tour" element={<DetailTourPage />} />
                </Routes>
            </Main>
            <ReactQueryDevtools initialIsOpen={false} />
        </>
    );
}

function App() {
    return (
        <Provider store={store}>
            <AppContent />
        </Provider>
    );
}

export default App;
