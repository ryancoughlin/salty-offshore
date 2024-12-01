import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { signOut } from '../../auth/supabase';
import { ROUTES } from '../../routes';

const AppBar = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (!error) {
      navigate(ROUTES.LOGIN);
    }
  };

  // Get user initials from email
  const getUserInitials = () => {
    if (!user?.email) return '?';
    return user.email
      .split('@')[0]
      .split('.')
      .map(part => part[0]?.toUpperCase() || '')
      .join('')
      .slice(0, 2);
  };

  return (
    <div className="w-12 h-full py-4 bg-neutral-950 flex flex-col items-center">
      <a
        href="/"
        className="w-8 h-8 mb-auto"
        aria-label="Return to SaltyOffshore Ocean Data home"
        tabIndex={0}
      >
        <img
          src="/Salty-Logo.svg"
          alt=""
          className="w-full h-full"
          aria-hidden="true"
        />
      </a>

      <div className="space-y-4">
        <button
          onClick={() => navigate(ROUTES.PROFILE)}
          className="w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center text-white font-medium text-sm transition-colors"
          aria-label={`Account settings for ${user?.email}`}
          title={user?.email}
        >
          {getUserInitials()}
        </button>

        <button
          onClick={() => navigate(ROUTES.PROFILE)}
          className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-neutral-400 hover:text-white transition-colors"
          aria-label="Account settings"
          title="Account settings"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </button>

        <button
          onClick={handleSignOut}
          className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-neutral-400 hover:text-white transition-colors"
          aria-label="Sign out"
          title="Sign out"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default AppBar; 