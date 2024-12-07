import { PanelLeftClose } from 'lucide-react';

interface CollapseButtonProps {
    isCollapsed: boolean;
    onToggle: () => void;
}

export default function CollapseButton({ isCollapsed, onToggle }: CollapseButtonProps) {
    return (
        <button
            onClick={onToggle}
            className={`
        absolute right-0 top-4 transform translate-x-1/2 
        bg-gray-800 rounded-full p-1 hover:bg-gray-700 
        transition-colors z-50
        ${isCollapsed ? 'h-16 w-8' : ''}
      `}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
            <PanelLeftClose
                className={`w-4 h-4 text-white ${isCollapsed ? 'rotate-180' : ''}`}
            />
        </button>
    );
} 