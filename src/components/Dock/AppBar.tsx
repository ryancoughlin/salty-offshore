import { Link } from 'react-router-dom';
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
      navigate(ROUTES.AUTH.LOGIN);
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
      <Link
        to="/"
        className="w-8 h-8 mb-auto"
        aria-label="Return to SaltyOffshore Ocean Data home"
      >
        <img
          src="/Salty-Logo.svg"
          alt=""
          className="w-full h-full"
          aria-hidden="true"
        />
      </Link>

      <div className="space-y-4">
        <Link
          to={ROUTES.ACCOUNT.PROFILE}
          className="w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center text-white font-medium text-sm transition-colors"
          aria-label={`Account settings for ${user?.email}`}
          title={user?.email}
        >
          {getUserInitials()}
        </Link>

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