import './Loader.css';

interface LoaderProps {
    isLoading: boolean;
}

function Loader({ isLoading }: LoaderProps) {
    if (!isLoading) return null;

    return (
        <div className="loader-container">
            <div className="loader-bar">
                <div className="loader-progress" />
            </div>
        </div>
    );
}

export default Loader;
