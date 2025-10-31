import { useAppSelector } from '../../store/hooks';
import type { PriceOffer } from '../../store/filtersSlice';
import { formatDate, formatPrice } from '../../utils/formatters';
import './DetailTourInfo.css';

type DetailTourInfoProps = {
    priceData: PriceOffer;
    nights: number;
};

function DetailTourInfo({ priceData, nights }: DetailTourInfoProps) {
    const usdRate = useAppSelector((state) => state.filters.usdRate);

    return (
        <div className="detail-tour-info">
            <h2>Інформація про тур</h2>
            <div className="detail-tour-info-grid">
                <div className="detail-tour-info-item">
                    <strong>Початок:</strong>
                    <span>{formatDate(priceData.startDate)}</span>
                </div>
                <div className="detail-tour-info-item">
                    <strong>Кінець:</strong>
                    <span>{formatDate(priceData.endDate)}</span>
                </div>
                <div className="detail-tour-info-item">
                    <strong>Тривалість:</strong>
                    <span>
                        {nights} {nights === 1 ? 'ніч' : 'ночі'}
                    </span>
                </div>
                <div className="detail-tour-info-item">
                    <strong>Ціна:</strong>
                    <span className="detail-tour-price">
                        {formatPrice(priceData.amount, usdRate)}
                    </span>
                </div>
            </div>
        </div>
    );
}

export default DetailTourInfo;
