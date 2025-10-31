import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getHotels } from '../../../../api/api';
import type { PricesMap } from '../../../../store/filtersSlice';
import { useAppSelector } from '../../../../store/hooks';
import { Loader } from '../../../../ui';
import { EmptyToursCards } from '../../../../ui/EmptyToursCards';
import HotelCard from '../../../../ui/HotelCard/HotelCard';
import { getCountryId } from '../../../../utils/getCountryId';
import './ListTours.css';

type Hotel = {
    id: number;
    name: string;
    img: string;
    cityId: number;
    cityName: string;
    countryId: string;
    countryName: string;
};

type HotelsMap = Record<string, Hotel>;

const formatDate = (iso: string) => {
    const [y, m, d] = iso.split('-');

    return `${d}.${m}.${y}`;
};

const generateCards = (
    items: Array<{
        id: string;
        price: number;
        currency: string;
        startDate: string;
        endDate: string;
        hotel: Hotel | null;
    }>,
    navigate: ReturnType<typeof useNavigate>,
    usdRate: number,
) =>
    items
        .filter((i) => i.hotel)
        .map((item) => {
            const h = item.hotel as Hotel;
            const desc = `Початок: ${formatDate(item.startDate)} — ${formatDate(
                item.endDate,
            )}`;
            const location = `${h.countryName}, ${h.cityName}`;

            const priceInUah =
                item.currency === 'usd' ? item.price * usdRate : item.price;

            return (
                <div key={item.id} className="tours-list-item">
                    <HotelCard
                        id={item.id}
                        name={h.name}
                        description={desc}
                        imageUrl={h.img}
                        price={priceInUah}
                        currency="грн"
                        location={location}
                        onViewDetails={() => {
                            navigate(`/detail-tour/${item.id}/${h.id}`);
                        }}
                    />
                </div>
            );
        });

function ListTours() {
    const { selectedGeo, usdRate } = useAppSelector((s) => s.filters);
    const countryId = getCountryId(selectedGeo);
    const queryClient = useQueryClient();
    const prices = queryClient.getQueryData(['prices', countryId]);
    const navigate = useNavigate();

    const { data: hotelsMap, isLoading: isLoadingHotels } = useQuery({
        queryKey: ['hotels', countryId],
        enabled: !!countryId,
        queryFn: async () => {
            const resp = await getHotels(countryId as string);
            const json = (await resp.json()) as HotelsMap;

            return json;
        },
    });

    const items = useMemo(() => {
        if (!prices || !hotelsMap)
            return [] as Array<{
                id: string;
                price: number;
                currency: string;
                startDate: string;
                endDate: string;
                hotel: Hotel | null;
            }>;

        return Object.values(prices as PricesMap).map((offer) => {
            const hotel = offer.hotelID
                ? hotelsMap[String(offer.hotelID)] ?? null
                : null;

            return {
                id: offer.id,
                price: offer.amount,
                currency: offer.currency,
                startDate: offer.startDate,
                endDate: offer.endDate,
                hotel,
            };
        });
    }, [prices, hotelsMap]);

    return (
        <div
            className={`tours-list-container ${
                items.filter((i) => i.hotel).length === 0 ? 'emptyCards' : ''
            }`}
        >
            {isLoadingHotels && (
                <div className="tours-list-empty">
                    <Loader />
                </div>
            )}

            {!isLoadingHotels && items.filter((i) => i.hotel).length === 0 && (
                <EmptyToursCards text="Турів не знайдено" />
            )}

            {generateCards(items, navigate, usdRate)}
        </div>
    );
}

export default ListTours;
