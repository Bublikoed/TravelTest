import React from 'react';
import './Loader.css';

export interface LoaderProps {
    size?: 'small' | 'medium' | 'large';
    color?: string;
    label?: string;
    className?: string;
}

function Loader({
    size = 'medium',
    color,
    label = 'Завантаження...',
    className = '',
}: LoaderProps): React.ReactElement {
    const classes = ['loader', `loader--${size}`, className]
        .filter(Boolean)
        .join(' ');

    const style: React.CSSProperties | undefined = color
        ? ({ '--loader-color': color } as React.CSSProperties)
        : undefined;

    return (
        <div
            className={classes}
            role="status"
            aria-live="polite"
            aria-label={label}
            style={style}
        >
            <span className="loader__spinner" aria-hidden="true" />
            {label && <span className="loader__label">{label}</span>}
        </div>
    );
}

export default Loader;
