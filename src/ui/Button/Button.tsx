/* eslint-disable react/prop-types, react/require-default-props */
import React from 'react';
import './Button.css';

export interface ButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    variant?: 'primary' | 'secondary';
    size?: 'small' | 'medium' | 'large';
    className?: string;
    disabled?: boolean;
}

function Button({
    children,
    onClick,
    variant = 'primary',
    size = 'medium',
    disabled = false,
    className = '',
}: ButtonProps) {
    const handleClick = () => {
        if (onClick) {
            onClick();
        }
    };

    const buttonClasses = [
        'button',
        `button--${variant}`,
        `button--${size}`,
        disabled ? 'button--disabled' : '',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <button
            type="button"
            onClick={handleClick}
            className={buttonClasses}
            disabled={disabled}
        >
            {children}
        </button>
    );
}

export default Button;
