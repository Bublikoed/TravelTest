import { useNavigate } from 'react-router-dom';
import './DetailTourError.css';

type DetailTourErrorProps = {
    errorMessage: string;
};

function DetailTourError({ errorMessage }: DetailTourErrorProps) {
    const navigate = useNavigate();

    return (
        <div className="detail-tour">
            <div className="detail-tour-error">
                <h2>Помилка завантаження</h2>
                <p>{errorMessage}</p>
                <button
                    type="button"
                    className="detail-tour-back-button"
                    onClick={() => navigate(-1)}
                >
                    Повернутися назад
                </button>
            </div>
        </div>
    );
}

export default DetailTourError;
