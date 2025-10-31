import { getServiceLabel, getServiceStatus } from '../../utils/formatters';
import './DetailTourServices.css';

type HotelServices = {
    wifi: string;
    aquapark: string;
    tennis_court: string;
    laundry: string;
    parking: string;
};

type DetailTourServicesProps = {
    services: HotelServices;
};

function DetailTourServices({ services }: DetailTourServicesProps) {
    return (
        <div className="detail-tour-services">
            <h2>Зручності готелю</h2>
            <div className="detail-tour-services-grid">
                {Object.entries(services).map(([key, value]) => {
                    if (value === 'none') return null;

                    return (
                        <div key={key} className="detail-tour-service-item">
                            <span className="detail-tour-service-label">
                                {getServiceLabel(key)}:
                            </span>
                            <span className="detail-tour-service-value">
                                {getServiceStatus(value)}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default DetailTourServices;
