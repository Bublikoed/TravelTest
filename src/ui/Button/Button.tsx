/* eslint-disable react/prop-types, react/require-default-props */
import React from 'react';
import './Button.css';

export interface ButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    type?: 'button' | 'submit';
    variant?:
        | 'primary'
        | 'secondary'
        | 'outline'
        | 'ghost'
        | 'danger'
        | 'success';
    size?: 'small' | 'medium' | 'large';
    disabled?: boolean;
    loading?: boolean;
    fullWidth?: boolean;
    className?: string;
    id?: string;
    form?: string;
    autoFocus?: boolean;
    onFocus?: () => void;
    onBlur?: () => void;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    loadingText?: string;
}

function Button({
    children,
    onClick,
    type = 'button',
    variant = 'primary',
    size = 'medium',
    disabled = false,
    loading = false,
    fullWidth = false,
    className = '',
    id,
    form,
    autoFocus,
    onFocus,
    onBlur,
    onMouseEnter,
    onMouseLeave,
    leftIcon,
    rightIcon,
    loadingText = 'Завантаження...',
}: ButtonProps) {
    const handleClick = () => {
        if (!disabled && !loading && onClick) {
            onClick();
        }
    };

    const buttonClasses = [
        'button',
        `button--${variant}`,
        `button--${size}`,
        fullWidth ? 'button--full-width' : '',
        disabled ? 'button--disabled' : '',
        loading ? 'button--loading' : '',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    const renderContent = () => {
        if (loading) {
            return (
                <>
                    <span className="button-spinner" />
                    {loadingText}
                </>
            );
        }

        return (
            <>
                {leftIcon && (
                    <span className="button-icon button-icon--left">
                        {leftIcon}
                    </span>
                )}
                {children}
                {rightIcon && (
                    <span className="button-icon button-icon--right">
                        {rightIcon}
                    </span>
                )}
            </>
        );
    };

    return (
        <button
            id={id}
            type={type === 'submit' ? 'submit' : 'button'}
            form={form}
            onClick={handleClick}
            disabled={disabled || loading}
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus={autoFocus}
            onFocus={onFocus}
            onBlur={onBlur}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            className={buttonClasses}
        >
            {renderContent()}
        </button>
    );
}

export default Button;
