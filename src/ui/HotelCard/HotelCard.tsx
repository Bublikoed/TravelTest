/* eslint-disable react/prop-types, react/require-default-props */
import './HotelCard.css';

export interface HotelCardProps {
    id: string | number;
    name: string;
    description?: string;
    price: number;
    currency?: string;
    rating?: number;
    maxRating?: number;
    imageUrl?: string;
    location?: string;
    amenities?: string[];
    isAvailable?: boolean;
    discount?: number;
    originalPrice?: number;
    onBook?: (hotelId: string | number) => void;
    onViewDetails?: (hotelId: string | number) => void;
    onFavorite?: (hotelId: string | number) => void;
    isFavorite?: boolean;
    className?: string;
    size?: 'small' | 'medium' | 'large';
    variant?: 'default' | 'compact' | 'detailed';
    showBookButton?: boolean;
    showDetailsButton?: boolean;
    showFavoriteButton?: boolean;
}

function HotelCard({
    id,
    name,
    description,
    price,
    currency = 'грн',
    rating,
    maxRating = 5,
    imageUrl,
    location,
    amenities = [],
    isAvailable = true,
    discount,
    originalPrice,
    onBook,
    onViewDetails,
    onFavorite,
    isFavorite = false,
    className = '',
    size = 'medium',
    variant = 'default',
    showBookButton = true,
    showDetailsButton = true,
    showFavoriteButton = true,
}: HotelCardProps) {
    const handleBook = () => {
        if (onBook && isAvailable) {
            onBook(id);
        }
    };

    const handleViewDetails = () => {
        if (onViewDetails) {
            onViewDetails(id);
        }
    };

    const handleFavorite = () => {
        if (onFavorite) {
            onFavorite(id);
        }
    };

    const formatPrice = (amount: number) =>
        new Intl.NumberFormat('uk-UA').format(amount);

    const renderStars = () => {
        if (!rating) return null;

        return (
            <div className="hotel-card-rating">
                {Array.from({ length: maxRating }, (_, index) => (
                    <span
                        key={index}
                        className={`hotel-card-star ${
                            index < rating ? 'hotel-card-star--filled' : ''
                        }`}
                    >
                        ★
                    </span>
                ))}
                <span className="hotel-card-rating-text">{rating}</span>
            </div>
        );
    };

    const renderAmenities = () => {
        if (amenities.length === 0) return null;

        return (
            <div className="hotel-card-amenities">
                {amenities.slice(0, 3).map((amenity) => (
                    <span key={amenity} className="hotel-card-amenity">
                        {amenity}
                    </span>
                ))}
                {amenities.length > 3 && (
                    <span className="hotel-card-amenity hotel-card-amenity--more">
                        +{amenities.length - 3}
                    </span>
                )}
            </div>
        );
    };

    const cardClasses = [
        'hotel-card',
        `hotel-card--${size}`,
        `hotel-card--${variant}`,
        !isAvailable ? 'hotel-card--unavailable' : '',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <div className={cardClasses}>
            {discount && (
                <div className="hotel-card-discount">-{discount}%</div>
            )}

            {showFavoriteButton && (
                <button
                    type="button"
                    className={`hotel-card-favorite ${
                        isFavorite ? 'hotel-card-favorite--active' : ''
                    }`}
                    onClick={handleFavorite}
                    aria-label={
                        isFavorite
                            ? 'Видалити з улюблених'
                            : 'Додати до улюблених'
                    }
                >
                    {isFavorite ? '❤️' : '🤍'}
                </button>
            )}

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

                {description && variant !== 'compact' && (
                    <p className="hotel-card-description">{description}</p>
                )}

                {renderStars()}

                {renderAmenities()}

                <div className="hotel-card-price-section">
                    <div className="hotel-card-price">
                        {originalPrice && originalPrice > price && (
                            <span className="hotel-card-original-price">
                                {formatPrice(originalPrice)} {currency}
                            </span>
                        )}
                        <span className="hotel-card-current-price">
                            {formatPrice(price)} {currency}
                        </span>
                        <span className="hotel-card-period">/ніч</span>
                    </div>
                </div>

                <div className="hotel-card-actions">
                    {showDetailsButton && (
                        <button
                            type="button"
                            className="hotel-card-button hotel-card-button--secondary"
                            onClick={handleViewDetails}
                        >
                            Деталі
                        </button>
                    )}
                    {showBookButton && (
                        <button
                            type="button"
                            className="hotel-card-button hotel-card-button--primary"
                            onClick={handleBook}
                            disabled={!isAvailable}
                        >
                            {isAvailable ? 'Забронювати' : 'Недоступно'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default HotelCard;
