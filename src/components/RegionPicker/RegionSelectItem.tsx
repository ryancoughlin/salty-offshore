import { RegionImage } from './RegionImage';

interface RegionSelectItemProps {
    name: string;
    thumbnail: string;
    selected: boolean;
    onClick: () => void;
}

export const RegionSelectItem: React.FC<RegionSelectItemProps> = ({
    name,
    thumbnail,
    selected,
    onClick,
}) => {
    return (
        <div 
            onClick={onClick}
            className={`
                flex justify-between p-4 cursor-pointer
                hover:bg-white/5 transition-colors duration-150
                ${selected ? 'bg-white/10' : ''}
            `}
            role="button"
            tabIndex={0}
            aria-selected={selected}
            onKeyDown={(e) => e.key === 'Enter' && onClick()}
        >
            <div className="text-white text-lg font-['Spline Sans']">
                {name}
            </div>
            <RegionImage thumbnail={thumbnail} name={name} />
        </div>
    );
}; 