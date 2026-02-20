// export default Navbar;
import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";
import { useAuth } from "../hooks/useAuth";

interface NavbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onSearch: () => void;
}

const Navbar = ({ searchQuery, onSearchChange, onSearch }: NavbarProps) => {
  // consume auth context — get user and logout
  const { user, logout } = useAuth();

  return (
    <nav className="bg-gray-900 border-b border-gray-700 px-8 py-4 flex items-center justify-between sticky top-0 z-50">
      {/* Logo */}
      <Link
        to="/"
        className="text-yellow-400 text-2xl font-black tracking-tight"
      >
        🎬 IMDB<span className="text-white">Clone</span>
      </Link>

      {/* Search */}
      <SearchBar
        value={searchQuery}
        onChange={onSearchChange}
        onSearch={onSearch}
      />

      {/* Nav Links */}
      <div className="flex items-center gap-6">
        <Link
          to="/"
          className="text-gray-300 hover:text-yellow-400 transition-colors font-medium"
        >
          Home
        </Link>
        <Link
          to="/watchlist"
          className="text-gray-300 hover:text-yellow-400 transition-colors font-medium"
        >
          Watchlist
        </Link>

        {/* TS LESSON: conditional rendering based on user state */}
        {user ? (
          // logged in — show username + logout
          <div className="flex items-center gap-4">
            <span className="text-yellow-400 font-medium">👤 {user.name}</span>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
            >
              Logout
            </button>
          </div>
        ) : (
          // not logged in — show login link
          <Link
            to="/login"
            className="text-gray-300 hover:text-yellow-400 transition-colors font-medium"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
