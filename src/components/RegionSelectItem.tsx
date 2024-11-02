export const RegionSelectItem: React.FC<RegionSelectItemProps> = ({
    name,
    selected,
    onClick,
}) => {
    return (
        <button
            onClick={onClick}
            className="w-full px-6 py-4 text-left transition-colors duration-150 ease-in-out hover:bg-white/5"
            role="option"
            aria-selected={selected}
        >
            <span className="text-white text-xl font-['Spline Sans']">{name}</span>
        </button>
    );
}; 