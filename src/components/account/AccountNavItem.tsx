interface AccountNavItemProps {
    icon: React.ReactNode;
    label: string;
    isActive?: boolean;
    onClick?: () => void;
}

export const AccountNavItem = ({
    icon,
    label,
    isActive,
    onClick
}: AccountNavItemProps) => {
    return (
        <button
            onClick={onClick}
            className={`w-full p-4 flex items-center gap-4 border-b border-white/10 transition-colors
                ${isActive ? 'bg-white' : 'bg-transparent hover:bg-white/5'}`}
        >
            <div className={`w-6 h-6 ${isActive ? 'text-neutral-900' : 'text-white'}`}>
                {icon}
            </div>
            <span className={`text-label ${isActive ? 'text-neutral-900' : 'text-white'}`}>
                {label}
            </span>
        </button>
    );
}; 