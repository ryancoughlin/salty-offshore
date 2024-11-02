interface RegionSelectItemProps {
    name: string;
    selected?: boolean;
    onClick: () => void;
}

export const RegionSelectItem: React.FC<RegionSelectItemProps> = ({
    name,
    selected,
    onClick,
}) => (
    <button
        onClick={onClick}
        className="w-full px-6 py-4 text-white text-xl font-['Spline Sans'] text-left transition-colors duration-150 ease-in-out hover:bg-white/5"
        role="option"
        aria-selected={selected}
    >
        {name}
    </button>
); 