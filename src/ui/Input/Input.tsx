/* eslint-disable react/prop-types, react/require-default-props */
/* prettier-ignore */
import React from "react";
import './Input.css';

export interface InputProps {
    // prettier-ignore
    type?: "text" | "email" | "password" | "number" | "tel" | "url" | "search" | "date";
    placeholder?: string;
    value?: string;
    onChange?: (value: string) => void;
    onBlur?: () => void;
    onFocus?: () => void;
    disabled?: boolean;
    required?: boolean;
    error?: string;
    label?: string;
    helperText?: string;
    size?: 'small' | 'medium' | 'large';
    variant?: 'outlined' | 'filled' | 'standard';
    className?: string;
    id?: string;
    name?: string;
    autoComplete?: string;
    maxLength?: number;
    minLength?: number;
    pattern?: string;
    readOnly?: boolean;
}

function Input({
    type = 'text',
    placeholder,
    value,
    onChange,
    onBlur,
    onFocus,
    disabled = false,
    required = false,
    error,
    label,
    helperText,
    size = 'medium',
    variant = 'outlined',
    className = '',
    id,
    name,
    autoComplete,
    maxLength,
    minLength,
    pattern,
    readOnly = false,
}: InputProps) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (onChange) {
            onChange(e.target.value);
        }
    };

    const inputClasses = [
        'input',
        `input--${size}`,
        `input--${variant}`,
        error ? 'input--error' : '',
        disabled ? 'input--disabled' : '',
        readOnly ? 'input--readonly' : '',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <div className="input-container">
            {label && (
                <label htmlFor={id} className="input-label">
                    {label}
                    {required && <span className="input-required">*</span>}
                </label>
            )}
            <input
                id={id}
                name={name}
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={handleChange}
                onBlur={onBlur}
                onFocus={onFocus}
                disabled={disabled}
                required={required}
                readOnly={readOnly}
                autoComplete={autoComplete}
                maxLength={maxLength}
                minLength={minLength}
                pattern={pattern}
                className={inputClasses}
            />
            {error && <span className="input-error-text">{error}</span>}
            {helperText && !error && (
                <span className="input-helper-text">{helperText}</span>
            )}
        </div>
    );
}

export default Input;
