import { Check } from 'lucide-react';
import { ComponentProps } from 'react';

interface ToggleProps extends Omit<ComponentProps<'button'>, 'onChange'> {
    checked: boolean;
    onChange: (checked: boolean) => void;
    disabled?: boolean;
}

const Toggle = ({ checked, onChange, disabled = false, ...props }: ToggleProps) => {
    const handleClick = () => {
        if (!disabled) {
            onChange(!checked);
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            handleClick();
        }
    };

    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            tabIndex={0}
            disabled={disabled}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            className={`
                relative flex h-6 w-12 cursor-pointer items-center p-0.5
                transition-colors duration-200 ease-in-out
                ${checked ? 'bg-blue-600' : 'bg-neutral-400'}
                ${disabled ? 'cursor-not-allowed opacity-50' : ''}
            `}
            {...props}
        >
            <div
                className={`
                    absolute h-5 w-5 bg-white shadow-sm
                    transition-all duration-200 ease-in-out
                    ${checked ? 'translate-x-6' : 'translate-x-0'}
                `}
            >
                {checked && (
                    <Check
                        className="h-full w-full p-1 text-blue-600"
                        strokeWidth={2.8}
                    />
                )}
            </div>
        </button>
    );
};

export default Toggle; 