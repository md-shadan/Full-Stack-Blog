import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <header className="border-b border-black/10 bg-white/70 backdrop-blur">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <Link to="/" className="text-xl font-bold tracking-tight text-ink">Tech Blog</Link>
        <nav className="flex items-center gap-4">
          <NavLink to="/" className="text-sm font-semibold text-ink/70 hover:text-ink">Home</NavLink>
          {isAuthenticated && (
            <NavLink to="/dashboard" className="text-sm font-semibold text-ink/70 hover:text-ink">Dashboard</NavLink>
          )}
          {!isAuthenticated ? (
            <>
              <NavLink to="/login" className="text-sm font-semibold text-ink/70 hover:text-ink">Login</NavLink>
              <NavLink to="/register" className="btn btn-primary text-sm">Register</NavLink>
            </>
          ) : (
            <>
              <span className="text-sm text-ink/60">{user?.name}</span>
              <button onClick={logout} className="btn btn-outline text-sm">Logout</button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
