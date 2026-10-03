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

export const router = createBrowserRouter([
  // Public Root Landing Page & Auth
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/landing',
    element: <LandingPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
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

  // Main App Shell
  {
    element: <AppLayout />,
    children: [
      {
        path: '/home',
        element: <HomePage />,
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
    element: <Navigate to="/home" replace />,
  },
]);
