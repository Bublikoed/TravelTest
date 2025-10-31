/* eslint-disable react/prop-types, react/require-default-props */
import './EmptyToursCards.css';

export interface EmptyToursCardsProps {
    text: string;
}

function EmptyToursCards({ text }: EmptyToursCardsProps) {
    return <div className="empty-tours-cards">{text}</div>;
}

export default EmptyToursCards;
