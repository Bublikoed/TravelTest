import './DetailTourDescription.css';

type DetailTourDescriptionProps = {
    description: string;
};

function DetailTourDescription({ description }: DetailTourDescriptionProps) {
    return (
        <div className="detail-tour-description">
            <h2>Опис готелю</h2>
            <p>{description}</p>
        </div>
    );
}

export default DetailTourDescription;
