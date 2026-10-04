import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { MobileNav } from './MobileNav';
import { MusicPlayer } from '../music/MusicPlayer';
import { MiniPlayer } from '../music/MiniPlayer';
import { ExpandedMobilePlayer } from '../music/ExpandedMobilePlayer';
import { ToastContainer } from '../ui/ToastContainer';
import { RedemptionModal } from '../rewards/RedemptionModal';
import { LoginRequiredModal } from '../auth/LoginRequiredModal';
import { usePlayerStore } from '../../store/playerStore';

export const AppLayout: React.FC = () => {
  const { currentSong } = usePlayerStore();

  return (
    <div className="flex min-h-screen bg-background text-text-primary font-sans antialiased transition-colors">
      {/* Desktop Left Sidebar */}
      <Sidebar />

      {/* Main Column */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen relative">
        <Navbar />

        {/* Content Container - with dynamic bottom padding so music players never obscure page content */}
        <main
          className={`flex-1 w-full max-w-7xl mx-auto px-4 sm:px-8 py-6 pb-36 ${
            currentSong ? 'md:pb-32' : 'md:pb-12'
          }`}
        >
          <Outlet />
        </main>

        {/* Desktop Fixed Player */}
        <MusicPlayer />

        {/* Mobile Mini Player */}
        <MiniPlayer />

        {/* Full Screen Expandable Mobile Player Modal */}
        <ExpandedMobilePlayer />

        {/* Mobile Bottom Navigation */}
        <MobileNav />

        {/* Global Notifications & Modals */}
        <ToastContainer />
        <RedemptionModal />
        <LoginRequiredModal />
      </div>
    </div>
  );
};
