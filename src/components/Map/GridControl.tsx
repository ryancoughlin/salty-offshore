interface GridControlProps {
    gridSize: number;
    onGridSizeChange: (size: number) => void;
}

export const GridControl: React.FC<GridControlProps> = ({
    gridSize,
    onGridSizeChange
}) => {
    return (
        <div className="absolute bottom-20 right-4 bg-white/90 backdrop-blur-sm rounded p-2">
            <label className="text-sm text-gray-700">
                Grid Size (degrees):
                <select
                    value={gridSize}
                    onChange={(e) => onGridSizeChange(Number(e.target.value))}
                    className="ml-2 p-1 rounded border"
                >
                    <option value="0.5">0.5°</option>
                    <option value="1">1°</option>
                    <option value="5">5°</option>
                    <option value="10">10°</option>
                </select>
            </label>
        </div>
    );
}; 