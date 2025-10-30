import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import Main from './main';
import DetailTourPage from './pages/DetailTour';
import SearchTourPage from './pages/SearchTour';

function App() {
    return (
        <>
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

export default App;
