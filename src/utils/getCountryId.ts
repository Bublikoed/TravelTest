type GeoItem = {
    id: string | number;
    name: string;
    type: 'country' | 'city' | 'hotel';
    countryId?: string;
};

export const getCountryId = (
    geo: GeoItem | null | undefined,
): string | null => {
    if (!geo) return null;

    if (geo.type === 'country') {
        return String(geo.id);
    }

    return geo.countryId ?? null;
};
