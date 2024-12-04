interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary';
    children: React.ReactNode;
}

export const Button = ({
    variant = 'primary',
    children,
    className,
    ...props
}: ButtonProps) => {
    return (
        <button
            className={`text-label px-4 py-2 transition-colors
                ${variant === 'primary'
                    ? 'bg-yellow-300 text-black hover:bg-yellow-400'
                    : 'bg-neutral-900 text-zinc-100 hover:bg-neutral-800'}
                ${className || ''}`}
            {...props}
        >
            {children}
        </button>
    );
}; 