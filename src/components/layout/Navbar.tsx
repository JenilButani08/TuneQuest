import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Search,
  Flame,
  Coins,
  ShieldCheck,
  User as UserIcon,
  LogOut,
  Settings,
  Award,
  Bell,
  Sun,
  Moon,
  Gift,
  FolderHeart,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useWalletStore } from '../../store/walletStore';
import { useThemeStore } from '../../store/themeStore';
import { Button } from '../ui/Button';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const { wallet } = useWalletStore();
  const { theme, resolvedTheme, setTheme } = useThemeStore();
  const navigate = useNavigate();
  const location = useLocation();

  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="sticky top-0 z-40 h-16 w-full bg-surface/90 backdrop-blur-md border-b border-border px-4 sm:px-6 flex items-center justify-between transition-colors">
      {/* Brand logo */}
      <div className="flex items-center gap-6">
        <Link to="/home" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-white shadow-soft-sm">
            <span className="font-display font-extrabold text-sm tracking-tight">TQ</span>
          </div>
          <span className="font-display font-bold text-lg text-text-primary tracking-tight">
            Tune<span className="text-primary">Quest</span>
          </span>
        </Link>

        {/* Unauthenticated Nav Links (Desktop) */}
        {!isAuthenticated && (
          <nav className="hidden md:flex items-center gap-5 text-sm font-medium text-text-secondary">
            <Link
              to="/home"
              className={`hover:text-text-primary transition-colors ${
                location.pathname === '/home' ? 'text-primary font-semibold' : ''
              }`}
            >
              Home
            </Link>
            <Link
              to="/browse"
              className={`hover:text-text-primary transition-colors ${
                location.pathname === '/browse' ? 'text-primary font-semibold' : ''
              }`}
            >
              Browse
            </Link>
            <Link
              to="/quiz"
              className={`hover:text-text-primary transition-colors ${
                location.pathname.startsWith('/quiz') ? 'text-primary font-semibold' : ''
              }`}
            >
              Quizzes
            </Link>
            <Link
              to="/rewards"
              className={`hover:text-text-primary transition-colors ${
                location.pathname.startsWith('/rewards') ? 'text-primary font-semibold' : ''
              }`}
            >
              Rewards
            </Link>
          </nav>
        )}
      </div>

      {/* Authenticated Global Quick Search Bar */}
      {isAuthenticated && (
        <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
          <div
            onClick={() => navigate('/search')}
            className="w-full flex items-center gap-2.5 px-3.5 py-1.5 bg-surface-secondary border border-border rounded-xl text-sm text-text-muted hover:border-primary/40 hover:text-text-secondary transition-all cursor-pointer"
          >
            <Search className="w-4 h-4 text-text-muted" />
            <span>Search songs, artists, playlists...</span>
            <kbd className="hidden lg:inline-block ml-auto text-[10px] bg-surface px-1.5 py-0.5 rounded text-text-muted border border-border font-mono">
              Ctrl+K
            </kbd>
          </div>
        </div>
      )}

      {/* Right Action Cluster */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Theme Quick Toggle */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-border bg-surface-secondary hover:bg-border/60 text-text-secondary hover:text-text-primary transition-colors text-xs font-medium cursor-pointer shadow-soft-sm"
          title={`Switch to ${resolvedTheme === 'dark' ? 'Light' : 'Dark'} mode`}
        >
          {resolvedTheme === 'dark' ? (
            <>
              <Sun className="w-4 h-4 text-warning" />
              <span className="hidden sm:inline text-xs font-semibold">Light</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-primary" />
              <span className="hidden sm:inline text-xs font-semibold">Dark</span>
            </>
          )}
        </button>

        {isAuthenticated ? (
          <>
            {/* Daily Streak Pill */}
            <Link
              to="/profile"
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 hover:border-orange-500/40 transition-all text-xs font-semibold text-orange-600 dark:text-orange-400"
              title="Daily Challenge Streak"
            >
              <Flame className="w-3.5 h-3.5 text-orange-500" />
              <span>{user?.streak || 7}d</span>
            </Link>

            {/* TunePoints Wallet Pill */}
            <Link
              to="/rewards"
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 hover:border-amber-500/40 transition-all text-xs font-semibold text-amber-700 dark:text-amber-400"
              title="Your TunePoints Balance"
            >
              <Coins className="w-3.5 h-3.5 text-amber-500" />
              <span>{wallet.balance.toLocaleString()} TP</span>
            </Link>

            {/* Notification Bell */}
            <button
              onClick={() => navigate('/rewards')}
              className="p-2 rounded-xl text-text-muted hover:text-text-primary hover:bg-surface-secondary transition-colors relative"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary" />
            </button>

            {/* User Profile Avatar & Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                aria-label="User navigation menu"
                className="flex items-center gap-1.5 p-0.5 rounded-full hover:ring-2 hover:ring-primary/40 transition-all"
              >
                <img
                  src={user?.avatar || user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                  alt={user?.fullName || user?.displayName || 'User Avatar'}
                  className="w-8 h-8 rounded-full object-cover border border-border"
                />
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-56 ui-dropdown rounded-2xl p-1.5 z-50 text-sm">
                  <div className="p-2.5 border-b border-border mb-1">
                    <p className="font-semibold text-text-primary leading-tight truncate">
                      {user?.fullName || user?.displayName || 'Alex Rivers'}
                    </p>
                    <p className="text-xs text-text-muted mt-0.5 truncate">
                      @{user?.username || 'MusicExplorer'}
                    </p>
                  </div>

                  <div className="space-y-0.5">
                    <Link
                      to="/profile"
                      onClick={() => setShowDropdown(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-surface-secondary transition-colors"
                    >
                      <UserIcon className="w-4 h-4" />
                      <span>Profile</span>
                    </Link>
                    <Link
                      to="/library"
                      onClick={() => setShowDropdown(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-surface-secondary transition-colors"
                    >
                      <FolderHeart className="w-4 h-4" />
                      <span>My Library</span>
                    </Link>
                    <Link
                      to="/rewards"
                      onClick={() => setShowDropdown(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-surface-secondary transition-colors"
                    >
                      <Coins className="w-4 h-4" />
                      <span>Rewards</span>
                    </Link>
                    <Link
                      to="/referrals"
                      onClick={() => setShowDropdown(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-surface-secondary transition-colors"
                    >
                      <Gift className="w-4 h-4 text-primary" />
                      <span>Invite Friends</span>
                    </Link>
                    <Link
                      to="/settings"
                      onClick={() => setShowDropdown(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-surface-secondary transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                      <span>Settings</span>
                    </Link>
                  </div>

                  <div className="border-t border-border mt-1 pt-1">
                    <button
                      onClick={async () => {
                        setShowDropdown(false);
                        await logout();
                        navigate('/');
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-danger hover:bg-danger/10 transition-colors text-left font-medium"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          /* Unauthenticated Header State (Section 7, 8, 38) */
          <div className="flex items-center gap-2">
            <Link to="/login">
              <Button variant="outline" size="sm" className="font-semibold">
                Log In
              </Button>
            </Link>
            <Link to="/register" className="hidden sm:inline-block">
              <Button variant="primary" size="sm" className="font-semibold">
                Create Account
              </Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};
