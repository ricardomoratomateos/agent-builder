import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-gray-900">
            Agent Builder
          </Link>
          <nav className="space-x-4">
            <Link to="/" className="text-gray-600 hover:text-gray-900">
              Dashboard
            </Link>
            <Link to="/editor" className="text-gray-600 hover:text-gray-900">
              Editor
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
