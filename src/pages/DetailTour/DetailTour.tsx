import { withLoader } from '../../hocs';
import './DetailTour.css';

function DetailTourPage() {
    return (
        <div className="detail-tour">
            <h1>Деталі туру</h1>
        </div>
    );
}

// Експортуємо компонент з HOC
export default withLoader(DetailTourPage, {
    ignoreQueries: ['searchGeo'], // Ігноруємо запити пошуку геолокації
});
