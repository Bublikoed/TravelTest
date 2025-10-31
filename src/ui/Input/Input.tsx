/* eslint-disable react/prop-types, react/require-default-props */
/* prettier-ignore */
import React from "react";
import './Input.css';

export interface InputProps {
    placeholder?: string;
    value?: string;
    onChange?: (value: string) => void;
    onFocus?: () => void;
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    size?: 'small' | 'medium' | 'large';
    variant?: 'outlined' | 'filled' | 'standard';
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    (
        {
            placeholder,
            value,
            onChange,
            onFocus,
            onKeyDown,
            size = 'medium',
            variant = 'outlined',
        },
        ref,
    ) => {
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            if (onChange) {
                onChange(e.target.value);
            }
        };

        const inputClasses = ['input', `input--${size}`, `input--${variant}`]
            .filter(Boolean)
            .join(' ');

        return (
            <div className="input-container">
                <input
                    ref={ref}
                    type="text"
                    placeholder={placeholder}
                    value={value}
                    onChange={handleChange}
                    onFocus={onFocus}
                    onKeyDown={onKeyDown}
                    className={inputClasses}
                />
            </div>
        );
    },
);

Input.displayName = 'Input';

export default Input;
