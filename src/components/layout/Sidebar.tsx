import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  Home,
  Search,
  Compass,
  Sparkles,
  Trophy,
  Coins,
  Gift,
  FolderHeart,
  Heart,
  History,
  Flame,
  Award,
  Users2,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export const Sidebar: React.FC = () => {
  const { user } = useAuthStore();

  const navItemClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150 ${
      isActive
        ? 'bg-primary/10 text-primary font-semibold'
        : 'text-text-secondary hover:text-text-primary hover:bg-surface-secondary'
    }`;

  return (
    <aside className="hidden lg:flex flex-col w-60 h-screen sticky top-0 bg-surface border-r border-border p-4 z-40 select-none transition-colors">
      {/* Brand Header */}
      <Link to="/home" className="flex items-center gap-2.5 px-2 py-2 mb-4 group">
        <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-white shadow-soft-sm transition-transform group-hover:scale-105">
          <span className="font-display font-extrabold text-sm tracking-tight">TQ</span>
        </div>
        <div>
          <h1 className="font-display font-bold text-lg text-text-primary tracking-tight leading-none">
            Tune<span className="text-primary">Quest</span>
          </h1>
          <p className="text-[10px] text-text-muted font-medium uppercase tracking-wider mt-1">
            Listen • Play • Earn
          </p>
        </div>
      </Link>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto space-y-5 pr-1">
        {/* Main Explore */}
        <div>
          <p className="px-3 text-[11px] font-semibold text-text-muted uppercase tracking-wider mb-1.5">
            Discover
          </p>
          <nav className="space-y-0.5">
            <NavLink to="/home" className={navItemClass}>
              <Home className="w-4 h-4 text-primary" />
              <span>Home</span>
            </NavLink>
            <NavLink to="/search" className={navItemClass}>
              <Search className="w-4 h-4 text-text-secondary" />
              <span>Search</span>
            </NavLink>
            <NavLink to="/browse" className={navItemClass}>
              <Compass className="w-4 h-4 text-text-secondary" />
              <span>Browse</span>
            </NavLink>
          </nav>
        </div>

        {/* Gamified Quizzes */}
        <div>
          <div className="flex items-center justify-between px-3 mb-1.5">
            <p className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">
              Music Quiz
            </p>
            <span className="flex items-center gap-1 text-[10px] text-orange-600 dark:text-orange-400 font-bold bg-orange-500/10 px-1.5 py-0.5 rounded-full">
              <Flame className="w-3 h-3 text-orange-500" />
              {user?.streak || 7}d
            </span>
          </div>
          <nav className="space-y-0.5">
            <NavLink to="/quiz/daily" className={navItemClass}>
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span className="flex-1">Daily Challenge</span>
              <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">
                +50 TP
              </span>
            </NavLink>
            <NavLink to="/quiz" end className={navItemClass}>
              <Award className="w-4 h-4 text-text-secondary" />
              <span>All Challenges</span>
            </NavLink>
            <NavLink to="/leaderboard" className={navItemClass}>
              <Trophy className="w-4 h-4 text-text-secondary" />
              <span>Leaderboard</span>
            </NavLink>
          </nav>
        </div>

        {/* Rewards & Referrals */}
        <div>
          <p className="px-3 text-[11px] font-semibold text-text-muted uppercase tracking-wider mb-1.5">
            Rewards
          </p>
          <nav className="space-y-0.5">
            <NavLink to="/rewards" end className={navItemClass}>
              <Coins className="w-4 h-4 text-amber-500" />
              <span>TunePoints Wallet</span>
            </NavLink>
            <NavLink to="/rewards/redeem" className={navItemClass}>
              <Gift className="w-4 h-4 text-text-secondary" />
              <span>Redeem Perks</span>
            </NavLink>
            <NavLink to="/referrals" className={navItemClass}>
              <Users2 className="w-4 h-4 text-primary" />
              <span className="flex-1">Invite Friends</span>
              <span className="text-[10px] font-bold text-primary bg-primary-muted px-1.5 py-0.5 rounded">
                +100 TP
              </span>
            </NavLink>
          </nav>
        </div>

        {/* User Library */}
        <div>
          <p className="px-3 text-[11px] font-semibold text-text-muted uppercase tracking-wider mb-1.5">
            Library
          </p>
          <nav className="space-y-0.5">
            <NavLink to="/library" className={navItemClass}>
              <FolderHeart className="w-4 h-4 text-text-secondary" />
              <span>My Playlists</span>
            </NavLink>
            <NavLink to="/liked" className={navItemClass}>
              <Heart className="w-4 h-4 text-text-secondary" />
              <span>Liked Songs</span>
            </NavLink>
            <NavLink to="/history" className={navItemClass}>
              <History className="w-4 h-4 text-text-secondary" />
              <span>History</span>
            </NavLink>
          </nav>
        </div>
      </div>

      {/* Daily Challenge Card at Bottom */}
      <div className="mt-auto pt-3 border-t border-border">
        <Link
          to="/quiz/daily"
          className="block p-3 rounded-2xl bg-surface-secondary border border-border hover:border-primary/40 transition-all text-left"
        >
          <div className="flex items-center gap-1.5 mb-1">
            <Flame className="w-3.5 h-3.5 text-orange-500" />
            <span className="text-xs font-semibold text-text-primary">Daily Streak Active</span>
          </div>
          <p className="text-[11px] text-text-muted leading-tight">
            Complete today's challenge to maintain your {user?.streak || 7}-day streak!
          </p>
        </Link>
      </div>
    </aside>
  );
};
