import './DetailTourImage.css';

type DetailTourImageProps = {
    img: string;
    alt: string;
};

function DetailTourImage({ img, alt }: DetailTourImageProps) {
    return (
        <div className="detail-tour-image">
            <img src={img} alt={alt} />
        </div>
    );
}

export default DetailTourImage;
