/* eslint-disable react/prop-types, react/require-default-props */
import { Button } from '../Button';
import './HotelCard.css';

export interface HotelCardProps {
    id: string | number;
    name: string;
    description?: string;
    price: number;
    currency?: string;
    imageUrl?: string;
    location?: string;
    onViewDetails?: (hotelId: string | number) => void;
    className?: string;
}

function HotelCard({
    id,
    name,
    description,
    price,
    currency = 'грн',
    imageUrl,
    location,
    onViewDetails,
    className = '',
}: HotelCardProps) {
    const handleViewDetails = () => {
        if (onViewDetails) {
            onViewDetails(id);
        }
    };

    const formatPrice = (amount: number) =>
        new Intl.NumberFormat('uk-UA').format(amount);

    const cardClasses = ['hotel-card', className].filter(Boolean).join(' ');

    return (
        <div className={cardClasses}>
            {imageUrl && (
                <div className="hotel-card-image">
                    <img src={imageUrl} alt={name} />
                </div>
            )}

            <div className="hotel-card-content">
                <div className="hotel-card-header">
                    <h3 className="hotel-card-name">{name}</h3>
                    {location && (
                        <p className="hotel-card-location">📍 {location}</p>
                    )}
                </div>

                {description && (
                    <p className="hotel-card-description">{description}</p>
                )}

                <div className="hotel-card-price-section">
                    <div className="hotel-card-price">
                        <span className="hotel-card-current-price">
                            {formatPrice(price)} {currency}
                        </span>
                        <span className="hotel-card-period">/ніч</span>
                    </div>
                </div>

                <div className="hotel-card-actions">
                    <Button
                        variant="secondary"
                        size="small"
                        className="hotel-card-button"
                        onClick={handleViewDetails}
                    >
                        Деталі
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default HotelCard;
