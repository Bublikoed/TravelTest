import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { getHotels } from '../../../../api/api';
import type { PricesMap } from '../../../../store/filtersSlice';
import { useAppSelector } from '../../../../store/hooks';
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

function ListTours() {
    const { selectedGeo } = useAppSelector((s) => s.filters);
    const countryId = getCountryId(selectedGeo);
    const queryClient = useQueryClient();
    const prices = queryClient.getQueryData(['prices', countryId]);

    console.log('prices', prices);
    console.log('countryId', countryId);
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

    if (!prices) {
        return (
            <div className="tours-list-container">
                <div>турів не знайдено</div>
            </div>
        );
    }

    return (
        <div className="tours-list-container">
            {isLoadingHotels && <div>Завантаження готелів…</div>}

            {!isLoadingHotels && items.filter((i) => i.hotel).length === 0 && (
                <div>турів не знайдено</div>
            )}

            {items
                .filter((i) => i.hotel)
                .map((item) => {
                    const h = item.hotel as Hotel;
                    const desc = `Початок: ${formatDate(
                        item.startDate,
                    )} — ${formatDate(item.endDate)}`;
                    const location = `${h.countryName}, ${h.cityName}`;

                    return (
                        <div key={item.id} className="tours-list-item">
                            <HotelCard
                                id={item.id}
                                name={h.name}
                                description={desc}
                                imageUrl={h.img}
                                price={item.price}
                                currency={item.currency}
                                location={location}
                                showBookButton={false}
                            />
                            <a
                                className="tours-list-price-link"
                                href={`/price/${item.id}`}
                                target="_blank"
                                rel="noreferrer"
                            >
                                Відкрити ціну
                            </a>
                        </div>
                    );
                })}
        </div>
    );
}

export default ListTours;
