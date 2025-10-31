export const formatDate = (iso: string) => {
    const [y, m, d] = iso.split('-');

    return `${d}.${m}.${y}`;
};

export const formatPrice = (amount: number, course: number) => {
    const formatted = new Intl.NumberFormat('uk-UA').format(amount * course);
    const currencyUpper = 'грн';

    return `${formatted} ${currencyUpper}`;
};

export const getServiceLabel = (key: string): string => {
    const labels: Record<string, string> = {
        wifi: 'Wi-Fi',
        aquapark: 'Аквапарк',
        tennis_court: 'Тенісний корт',
        laundry: 'Пральня',
        parking: 'Парковка',
    };

    return labels[key] || key;
};

export const getServiceStatus = (value: string): string => {
    if (value === 'yes') return '✓ Є';

    return value;
};
