import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '../../components/layout/AppLayout';
import { ProtectedRoute } from '../../components/auth/ProtectedRoute';

// Public Pages
import { LandingPage } from '../../pages/Landing/LandingPage';
import { LoginPage } from '../../pages/Login/LoginPage';
import { RegisterPage } from '../../pages/Register/RegisterPage';
import { ForgotPasswordPage } from '../../pages/ForgotPassword/ForgotPasswordPage';
import { TermsPage } from '../../pages/Terms/TermsPage';
import { PrivacyPage } from '../../pages/Privacy/PrivacyPage';

// Main Application Pages
import { HomePage } from '../../pages/Home/HomePage';
import { SearchPage } from '../../pages/Search/SearchPage';
import { BrowsePage } from '../../pages/Browse/BrowsePage';
import { ArtistDetailPage } from '../../pages/Artist/ArtistDetailPage';
import { AlbumDetailPage } from '../../pages/Album/AlbumDetailPage';
import { PlaylistDetailPage } from '../../pages/Playlist/PlaylistDetailPage';
import { LibraryPage } from '../../pages/Library/LibraryPage';
import { LikedSongsPage } from '../../pages/Liked/LikedSongsPage';
import { HistoryPage } from '../../pages/History/HistoryPage';

// Quiz System Pages
import { QuizIndexPage } from '../../pages/Quiz/QuizIndexPage';
import { DailyQuizPage } from '../../pages/Quiz/DailyQuizPage';
import { QuizPlayPage } from '../../pages/Quiz/QuizPlayPage';
import { QuizResultPage } from '../../pages/Quiz/QuizResultPage';

// Rewards, Referrals & Profile
import { RewardsPage } from '../../pages/Rewards/RewardsPage';
import { ReferralsPage } from '../../pages/Referrals/ReferralsPage';
import { RedeemStorePage } from '../../pages/Rewards/RedeemStorePage';
import { LeaderboardPage } from '../../pages/Leaderboard/LeaderboardPage';
import { AchievementsPage } from '../../pages/Achievements/AchievementsPage';
import { ProfilePage } from '../../pages/Profile/ProfilePage';
import { SettingsPage } from '../../pages/Settings/SettingsPage';

import { useAuthStore } from '../../store/authStore';

// Intelligent Root Route (Section 13)
const RootRoute: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuthStore();
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <LandingPage />;
};

// Public Auth Route: redirects authenticated users to /dashboard (Section 35)
const PublicAuthRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuthStore();
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <>{children}</>;
};

export const router = createBrowserRouter([
  // Public Root Landing Page & Auth
  {
    path: '/',
    element: <RootRoute />,
  },
  {
    path: '/landing',
    element: <LandingPage />,
  },
  {
    path: '/login',
    element: (
      <PublicAuthRoute>
        <LoginPage />
      </PublicAuthRoute>
    ),
  },
  {
    path: '/register',
    element: (
      <PublicAuthRoute>
        <RegisterPage />
      </PublicAuthRoute>
    ),
  },
  {
    path: '/forgot-password',
    element: <ForgotPasswordPage />,
  },
  {
    path: '/terms',
    element: <TermsPage />,
  },
  {
    path: '/privacy',
    element: <PrivacyPage />,
  },

  // Main App Shell - All routes strictly protected by ProtectedRoute
  {
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: '/home',
        element: <HomePage />,
      },
      {
        path: '/dashboard',
        element: <Navigate to="/home" replace />,
      },
      {
        path: '/wallet',
        element: <Navigate to="/rewards" replace />,
      },
      {
        path: '/music',
        element: <Navigate to="/browse" replace />,
      },
      {
        path: '/search',
        element: <SearchPage />,
      },
      {
        path: '/browse',
        element: <BrowsePage />,
      },
      {
        path: '/discover',
        element: <BrowsePage />,
      },
      {
        path: '/playlist',
        element: <Navigate to="/library" replace />,
      },
      {
        path: '/song/:id',
        element: <BrowsePage />,
      },
      {
        path: '/artist/:id',
        element: <ArtistDetailPage />,
      },
      {
        path: '/album/:id',
        element: <AlbumDetailPage />,
      },
      {
        path: '/playlist/:id',
        element: <PlaylistDetailPage />,
      },

      // Authenticated Protected Routes (Section 33)
      {
        path: '/library',
        element: (
          <ProtectedRoute>
            <LibraryPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/liked',
        element: (
          <ProtectedRoute>
            <LikedSongsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/history',
        element: (
          <ProtectedRoute>
            <HistoryPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/quiz',
        element: (
          <ProtectedRoute>
            <QuizIndexPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/quiz/daily',
        element: (
          <ProtectedRoute>
            <DailyQuizPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/quiz/category/:id',
        element: (
          <ProtectedRoute>
            <DailyQuizPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/quiz/play/:id',
        element: (
          <ProtectedRoute>
            <QuizPlayPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/quiz/result/:id',
        element: (
          <ProtectedRoute>
            <QuizResultPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/rewards',
        element: (
          <ProtectedRoute>
            <RewardsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/rewards/redeem',
        element: (
          <ProtectedRoute>
            <RedeemStorePage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/referrals',
        element: (
          <ProtectedRoute>
            <ReferralsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/leaderboard',
        element: (
          <ProtectedRoute>
            <LeaderboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/achievements',
        element: (
          <ProtectedRoute>
            <AchievementsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/profile',
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/settings',
        element: (
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        ),
      },
    ],
  },

  // Fallback
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
