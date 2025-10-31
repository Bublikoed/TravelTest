import './DetailTourHeader.css';

type DetailTourHeaderProps = {
    name: string;
    countryName: string;
    cityName: string;
};

function DetailTourHeader({
    name,
    countryName,
    cityName,
}: DetailTourHeaderProps) {
    return (
        <div className="detail-tour-header">
            <h1>{name}</h1>
            <p className="detail-tour-location">
                📍 {countryName}, {cityName}
            </p>
        </div>
    );
}

export default DetailTourHeader;
