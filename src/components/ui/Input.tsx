interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    required?: boolean;
    helperText?: string;
}

export const Input = ({
    label,
    required,
    className,
    id,
    helperText,
    ...props
}: InputProps) => {
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
                id={inputId}
                className={`text-body p-2 bg-neutral-950/90 border border-neutral-700 text-white rounded-none
                    placeholder:text-neutral-500
                    focus-visible:outline-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                    disabled:opacity-50 disabled:cursor-not-allowed
                    ${className || ''}`}
                aria-required={required}
                aria-describedby={helperText ? `${inputId}-helper` : undefined}
                {...props}
            />
            {helperText && (
                <p id={`${inputId}-helper`} className="text-helper">
                    {helperText}
                </p>
            )}
        </div>
    );
}; 