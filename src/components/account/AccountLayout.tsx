import { useNavigate, useLocation } from 'react-router-dom';
import { User, WalletCards, Ship } from 'lucide-react';
import { AccountNavItem } from './AccountNavItem';
import { ROUTES } from '../../routes';

interface AccountLayoutProps {
    children: React.ReactNode;
}

export const AccountLayout = ({ children }: AccountLayoutProps) => {
    const navigate = useNavigate();
    const location = useLocation();

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
            <img
                src="/salty-logo-dark.png"
                alt="Salty Offshore"
                className="h-8 mx-auto mb-8"
            />
            <div className="max-w-4xl mx-auto">
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