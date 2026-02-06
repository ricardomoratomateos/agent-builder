import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-gray-900">
            Agent Builder
          </Link>
          <div className="flex items-center space-x-6">
            <nav className="space-x-4">
              <Link to="/" className="text-gray-600 hover:text-gray-900">
                Dashboard
              </Link>
              <Link to="/editor" className="text-gray-600 hover:text-gray-900">
                Editor
              </Link>
            </nav>
            {user && (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">{user.name}</span>
                <button
                  onClick={logout}
                  className="text-sm text-gray-600 hover:text-gray-900 font-medium"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
