import { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    required?: boolean;
    helperText?: string;
    error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
    label,
    required,
    className,
    id,
    helperText,
    error,
    ...props
}, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
        <div className="flex flex-col gap-2">
            {label && (
                <div className="flex items-center">
                    <label
                        htmlFor={inputId}
                        className="text-label text-white"
                    >
                        {label}
                    </label>
                    {required && (
                        <span
                            className="text-rose-600 text-lg font-light ml-1"
                            aria-hidden="true"
                        >
                            *
                        </span>
                    )}
                </div>
            )}
            <input
                ref={ref}
                id={inputId}
                className={`text-body p-2 bg-neutral-950/90 border text-white rounded-none
                    placeholder:text-neutral-500
                    focus-visible:outline-none focus:outline-none focus:ring-2 focus:border-transparent
                    disabled:opacity-50 disabled:cursor-not-allowed
                    ${error ? 'border-rose-500 focus:ring-rose-500' : 'border-neutral-700 focus:ring-blue-500'}
                    ${className || ''}`}
                aria-required={required}
                aria-invalid={!!error}
                aria-describedby={
                    error ? `${inputId}-error` :
                        helperText ? `${inputId}-helper` :
                            undefined
                }
                {...props}
            />
            {error ? (
                <p id={`${inputId}-error`} className="text-helper text-rose-500">
                    {error}
                </p>
            ) : helperText && (
                <p id={`${inputId}-helper`} className="text-helper">
                    {helperText}
                </p>
            )}
        </div>
    );
}); 