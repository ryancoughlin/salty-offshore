import { useNavigate, useLocation } from 'react-router-dom';
import { User, WalletCards, Ship, ArrowLeft } from 'lucide-react';
import { AccountNavItem } from './AccountNavItem';
import { ROUTES } from '../../routes';
import { Button } from '../ui/Button';

interface AccountLayoutProps {
    children: React.ReactNode;
}

export const AccountLayout = ({ children }: AccountLayoutProps) => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleBackToMap = () => {
        navigate('/', { state: { from: location.pathname } });
    };

    const navItems = [
        {
            id: 'profile',
            label: 'Edit Profile',
            icon: <User />,
            path: ROUTES.ACCOUNT.PROFILE
        },
        {
            id: 'billing',
            label: 'Billing',
            icon: <WalletCards />,
            path: ROUTES.ACCOUNT.BILLING
        },
        {
            id: 'boat',
            label: 'My Boat',
            icon: <Ship />,
            path: ROUTES.ACCOUNT.BOAT
        },
    ];

    return (
        <div className="min-h-screen bg-neutral-950 px-4 py-8">
            <div className="max-w-4xl mx-auto relative">
                <div className="flex items-center justify-between mb-8">
                    <Button
                        variant="invisible"
                        onClick={handleBackToMap}
                        className="flex items-center gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Map
                    </Button>
                    <img
                        src="/salty-logo-dark.png"
                        alt="Salty Offshore"
                        className="h-8 cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={handleBackToMap}
                        onKeyDown={(e) => e.key === 'Enter' && handleBackToMap()}
                        role="button"
                        tabIndex={0}
                    />
                    <div className="w-[104px]" /> {/* Spacer to balance the layout */}
                </div>
                <h1 className="text-display text-white mb-6">
                    Account Settings
                </h1>
                <div className="bg-neutral-900">
                    <div className="flex flex-col sm:flex-row">
                        <nav className="sm:w-80 border-b sm:border-b-0 sm:border-r border-white/10">
                            {navItems.map((item) => (
                                <AccountNavItem
                                    key={item.id}
                                    icon={item.icon}
                                    label={item.label}
                                    isActive={location.pathname === item.path}
                                    onClick={() => navigate(item.path)}
                                />
                            ))}
                        </nav>
                        <div className="flex-1 p-4 sm:p-8">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}; 