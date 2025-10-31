import type { GeoItem } from '../store/filtersSlice';

export const getCountryId = (
    geo: GeoItem | null | undefined,
): string | null => {
    if (!geo) return null;

    if (geo.type === 'country') {
        return String(geo.id);
    }

    return geo.countryId ?? null;
};
