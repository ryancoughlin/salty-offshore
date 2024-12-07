interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'invisible';
    children: React.ReactNode;
}

export const Button = ({
    variant = 'primary',
    children,
    className,
    ...props
}: ButtonProps) => {
    const baseClasses = 'text-label transition-colors';
    const variantClasses = {
        primary: 'px-4 py-2 bg-yellow-300 text-black hover:bg-yellow-400',
        secondary: 'px-4 py-2 bg-neutral-900 text-zinc-100 hover:bg-neutral-800',
        invisible: 'text-neutral-100 hover:bg-neutral-950 hover:text-neutral-100'
    };

    return (
        <button
            className={`${baseClasses} ${variantClasses[variant]} ${className || ''}`}
            {...props}
        >
            {children}
        </button>
    );
}; 