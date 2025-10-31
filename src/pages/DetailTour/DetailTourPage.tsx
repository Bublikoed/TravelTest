import { useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { getHotel, getPrice } from '../../api/api';
import DetailTourDescription from '../../components/DetailTourDescription';
import DetailTourError from '../../components/DetailTourError';
import DetailTourHeader from '../../components/DetailTourHeader';
import DetailTourImage from '../../components/DetailTourImage';
import DetailTourInfo from '../../components/DetailTourInfo';
import DetailTourLoading from '../../components/DetailTourLoading';
import DetailTourServices from '../../components/DetailTourServices';
import './DetailTourPage.css';

type PriceOffer = {
    id: string;
    amount: number;
    currency: string;
    startDate: string;
    endDate: string;
};

type HotelDetail = {
    id: number;
    name: string;
    img: string;
    cityId: number;
    cityName: string;
    countryId: string;
    countryName: string;
    description: string;
    services: {
        wifi: string;
        aquapark: string;
        tennis_court: string;
        laundry: string;
        parking: string;
    };
};

function DetailTourPage() {
    const { priceId, hotelId } = useParams<{
        priceId: string;
        hotelId: string;
    }>();
    const navigate = useNavigate();

    console.log('priceId', priceId);
    console.log('hotelId', hotelId);

    // Конвертуємо hotelId в число, оскільки в базі даних id - це число
    const hotelIdNumber = hotelId ? Number.parseInt(hotelId, 10) : null;

    const {
        data: priceData,
        isLoading: isLoadingPrice,
        isError: isErrorPrice,
        error: priceError,
    } = useQuery({
        queryKey: ['price', priceId],
        enabled: !!priceId,
        queryFn: async () => {
            if (!priceId) throw new Error('Price ID is required');

            try {
                const resp = await getPrice(priceId);

                if (!resp.ok) {
                    const errorData = await resp.json();

                    throw new Error(
                        errorData.message || 'Failed to load price',
                    );
                }

                return (await resp.json()) as PriceOffer;
            } catch (error) {
                if (error instanceof Response) {
                    const errorData = await error.json().catch(() => ({
                        message: 'Failed to load price',
                    }));

                    throw new Error(
                        errorData.message || 'Failed to load price',
                    );
                }
                throw error;
            }
        },
    });

    const {
        data: hotelData,
        isLoading: isLoadingHotel,
        isError: isErrorHotel,
        error: hotelError,
    } = useQuery({
        queryKey: ['hotel', hotelIdNumber],
        enabled: !!hotelIdNumber && !Number.isNaN(hotelIdNumber),
        queryFn: async () => {
            if (!hotelIdNumber || Number.isNaN(hotelIdNumber)) {
                throw new Error('Hotel ID is required and must be a number');
            }

            try {
                const resp = await getHotel(hotelIdNumber);

                if (!resp.ok) {
                    const errorData = await resp.json();

                    throw new Error(
                        errorData.message || 'Failed to load hotel',
                    );
                }

                return (await resp.json()) as HotelDetail;
            } catch (error) {
                if (error instanceof Response) {
                    const errorData = await error.json().catch(() => ({
                        message: 'Failed to load hotel',
                    }));

                    throw new Error(
                        errorData.message || 'Failed to load hotel',
                    );
                }
                throw error;
            }
        },
    });

    if (isLoadingPrice || isLoadingHotel) {
        return <DetailTourLoading />;
    }

    if (isErrorPrice || isErrorHotel || !priceData || !hotelData) {
        let errorMessage = 'Не вдалося завантажити дані про тур.';

        if (priceError instanceof Error) {
            errorMessage = priceError.message;
        } else if (hotelError instanceof Error) {
            errorMessage = hotelError.message;
        }

        return <DetailTourError errorMessage={errorMessage} />;
    }

    const nights =
        Math.ceil(
            (new Date(priceData.endDate).getTime() -
                new Date(priceData.startDate).getTime()) /
                (1000 * 60 * 60 * 24),
        ) || 1;

    return (
        <div className="detail-tour">
            <button
                type="button"
                className="detail-tour-back-button"
                onClick={() => navigate(-1)}
            >
                ← Повернутися назад
            </button>

            <div className="detail-tour-content">
                <DetailTourHeader
                    name={hotelData.name}
                    countryName={hotelData.countryName}
                    cityName={hotelData.cityName}
                />

                {hotelData.img && (
                    <DetailTourImage img={hotelData.img} alt={hotelData.name} />
                )}

                {hotelData.description && (
                    <DetailTourDescription
                        description={hotelData.description}
                    />
                )}

                <DetailTourInfo priceData={priceData} nights={nights} />

                <DetailTourServices services={hotelData.services} />
            </div>
        </div>
    );
}

export default DetailTourPage;
