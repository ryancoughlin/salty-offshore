import { useEffect, useState } from 'react';

interface BannerProps {
    message: string;
    type?: 'success' | 'error';
    duration?: number;
    onClose?: () => void;
}

export const Banner = ({
    message,
    type = 'success',
    duration = 3000,
    onClose
}: BannerProps) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            onClose?.();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    if (!isVisible) return null;

    return (
        <div
            role="alert"
            className={`fixed top-4 right-4 z-50 p-4 rounded-md shadow-lg
                ${type === 'success' ? 'bg-green-900/90 text-green-100' : 'bg-rose-900/90 text-rose-100'}`}
        >
            <div className="flex items-center gap-2">
                {type === 'success' ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                )}
                <p className="text-sm font-medium">{message}</p>
            </div>
        </div>
    );
}; 