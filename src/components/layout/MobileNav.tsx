import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Search, Sparkles, Coins, FolderHeart } from 'lucide-react';

export const MobileNav: React.FC = () => {
  const navItemClass = ({ isActive }: { isActive: boolean }) =>
    `flex flex-col items-center justify-center flex-1 py-2 gap-1 text-[11px] font-medium transition-all ${
      isActive
        ? 'text-primary font-bold'
        : 'text-text-muted hover:text-text-primary'
    }`;

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface/95 backdrop-blur-md border-t border-border px-2 py-1 flex items-center justify-around select-none transition-colors">
      <NavLink to="/home" className={navItemClass}>
        <Home className="w-5 h-5" />
        <span>Home</span>
      </NavLink>

      <NavLink to="/search" className={navItemClass}>
        <Search className="w-5 h-5" />
        <span>Search</span>
      </NavLink>

      <NavLink to="/quiz/daily" className={navItemClass}>
        <div className="relative">
          <Sparkles className="w-5 h-5 text-amber-500" />
          <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-amber-500" />
        </div>
        <span className="text-amber-600 dark:text-amber-400">Quiz</span>
      </NavLink>

      <NavLink to="/rewards" className={navItemClass}>
        <Coins className="w-5 h-5" />
        <span>Rewards</span>
      </NavLink>

      <NavLink to="/library" className={navItemClass}>
        <FolderHeart className="w-5 h-5" />
        <span>Library</span>
      </NavLink>
    </nav>
  );
};
