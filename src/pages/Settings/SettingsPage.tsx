import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  User,
  Sliders,
  Bell,
  Shield,
  Volume2,
  Trash2,
  Check,
  Sparkles,
  Info,
  Sun,
  Moon,
  Laptop,
  FileJson,
  Download,
  Eye,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';
import { useThemeStore, ThemePreference } from '../../store/themeStore';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { jsonStorageService } from '../../data/jsonStorageService';
import { authService } from '../../services/auth/authService';

export const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateUser, logout } = useAuthStore();
  const { addToast } = useUIStore();
  const { theme, setTheme, resolvedTheme } = useThemeStore();

  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [audioQuality, setAudioQuality] = useState('320');
  const [volumeNormalization, setVolumeNormalization] = useState(true);
  const [triviaSoundEffects, setTriviaSoundEffects] = useState(true);
  const [dailyStreakReminder, setDailyStreakReminder] = useState(true);
  const [showJsonViewer, setShowJsonViewer] = useState(false);

  const signupsList = jsonStorageService.getSignups();
  const registeredUsersCount = jsonStorageService.getRegisteredUsers().length;

  const handleSaveAccount = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({ displayName, email });
    addToast({
      type: 'success',
      title: 'Settings Saved',
      message: 'Your account preferences have been updated.',
    });
  };

  const handleResetDemoData = () => {
    if (
      confirm(
        'Reset all TuneQuest demo data?\n\nThis will remove locally stored demo users, points, transactions and preferences.'
      )
    ) {
      authService.resetAllDemoData();
      addToast({
        type: 'info',
        title: 'Demo Data Reset',
        message: 'Local TuneQuest demo data has been reset to defaults.',
      });
      navigate('/login');
    }
  };

  const handleThemeChange = (newTheme: ThemePreference) => {
    setTheme(newTheme);
    addToast({
      type: 'info',
      title: 'Theme Updated',
      message: `Appearance set to ${newTheme.charAt(0).toUpperCase() + newTheme.slice(1)}.`,
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-2 pb-16">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-text-primary flex items-center gap-2.5">
          <SettingsIcon className="w-7 h-7 text-primary" /> Preferences & Settings
        </h1>
        <p className="text-xs sm:text-sm text-text-secondary mt-1">
          Manage your appearance, audio quality, notifications, and profile details.
        </p>
      </div>

      {/* Section 5: THEME SWITCHER */}
      <Card className="p-6 sm:p-7 shadow-soft-sm space-y-4">
        <div>
          <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
            <Sun className="w-4 h-4 text-primary" /> Appearance
          </h3>
          <p className="text-xs text-text-secondary mt-0.5">
            Choose your preferred theme or match your system preferences.
          </p>
        </div>

        {/* Compact Segmented Control (Requirements Section 5 & 6) */}
        <div className="grid grid-cols-3 gap-3 max-w-md">
          <button
            type="button"
            onClick={() => handleThemeChange('light')}
            className={`p-3.5 rounded-xl border flex flex-col items-center gap-2 transition-all cursor-pointer ${
              theme === 'light'
                ? 'bg-primary/10 border-primary text-primary font-semibold shadow-soft-sm'
                : 'bg-surface-secondary border-border text-text-secondary hover:text-text-primary'
            }`}
          >
            <Sun className="w-5 h-5" />
            <span className="text-xs">Light</span>
          </button>

          <button
            type="button"
            onClick={() => handleThemeChange('dark')}
            className={`p-3.5 rounded-xl border flex flex-col items-center gap-2 transition-all cursor-pointer ${
              theme === 'dark'
                ? 'bg-primary/10 border-primary text-primary font-semibold shadow-soft-sm'
                : 'bg-surface-secondary border-border text-text-secondary hover:text-text-primary'
            }`}
          >
            <Moon className="w-5 h-5" />
            <span className="text-xs">Dark</span>
          </button>

          <button
            type="button"
            onClick={() => handleThemeChange('system')}
            className={`p-3.5 rounded-xl border flex flex-col items-center gap-2 transition-all cursor-pointer ${
              theme === 'system'
                ? 'bg-primary/10 border-primary text-primary font-semibold shadow-soft-sm'
                : 'bg-surface-secondary border-border text-text-secondary hover:text-text-primary'
            }`}
          >
            <Laptop className="w-5 h-5" />
            <span className="text-xs">System</span>
          </button>
        </div>

        <p className="text-[11px] text-text-muted">
          Active theme: <strong className="capitalize text-text-secondary">{resolvedTheme}</strong>
          {theme === 'system' && ' (automatically following OS preferences)'}.
        </p>
      </Card>

      {/* Account Section */}
      <Card className="p-6 sm:p-7 shadow-soft-sm space-y-5">
        <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
          <User className="w-4 h-4 text-primary" /> Account Profile
        </h3>

        <form onSubmit={handleSaveAccount} className="space-y-4 max-w-lg">
          <Input
            label="Display Name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />

          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Button type="submit" variant="primary" size="md">
            Save Changes
          </Button>
        </form>
      </Card>

      {/* Audio Playback Settings */}
      <Card className="p-6 sm:p-7 shadow-soft-sm space-y-5">
        <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
          <Volume2 className="w-4 h-4 text-primary" /> Audio Playback Quality
        </h3>

        <div className="space-y-4 max-w-lg">
          <div>
            <label className="block text-xs font-semibold text-text-secondary mb-2">
              Streaming Bitrate
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: '160', label: '160 kbps (Standard)' },
                { id: '320', label: '320 kbps (High)' },
                { id: 'flac', label: 'FLAC (Lossless VIP)' },
              ].map((q) => (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => setAudioQuality(q.id)}
                  className={`p-3 rounded-xl border text-xs font-semibold text-center transition-all cursor-pointer ${
                    audioQuality === q.id
                      ? 'bg-primary/10 border-primary text-primary font-bold'
                      : 'bg-surface-secondary border-border text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {q.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div>
              <p className="text-sm font-semibold text-text-primary">Normalize Volume</p>
              <p className="text-xs text-text-secondary">Set balanced volume across tracks</p>
            </div>
            <input
              type="checkbox"
              checked={volumeNormalization}
              onChange={(e) => setVolumeNormalization(e.target.checked)}
              className="w-4 h-4 rounded text-primary focus:ring-primary/20 accent-primary cursor-pointer"
            />
          </div>
        </div>
      </Card>

      {/* Gamification & Notifications */}
      <Card className="p-6 sm:p-7 shadow-soft-sm space-y-4">
        <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
          <Bell className="w-4 h-4 text-primary" /> Notifications & Sound
        </h3>

        <div className="space-y-3 max-w-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-text-primary">Trivia Sound Effects</p>
              <p className="text-xs text-text-secondary">Sound chimes on answers and timers</p>
            </div>
            <input
              type="checkbox"
              checked={triviaSoundEffects}
              onChange={(e) => setTriviaSoundEffects(e.target.checked)}
              className="w-4 h-4 rounded text-primary focus:ring-primary/20 accent-primary cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-text-primary">Daily Streak Reminders</p>
              <p className="text-xs text-text-secondary">Alerts to protect your streak before midnight</p>
            </div>
            <input
              type="checkbox"
              checked={dailyStreakReminder}
              onChange={(e) => setDailyStreakReminder(e.target.checked)}
              className="w-4 h-4 rounded text-primary focus:ring-primary/20 accent-primary cursor-pointer"
            />
          </div>
        </div>
      </Card>

      {/* Section: JSON DATA STORE & SIGN-UP DATABASE */}
      <Card className="p-6 sm:p-7 shadow-soft-sm space-y-5 border border-primary/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
              <FileJson className="w-5 h-5 text-primary" /> Central JSON Data Store (`src/data/`)
            </h3>
            <p className="text-xs text-text-secondary mt-0.5">
              100% of TuneQuest full web app data, sign-ups, songs, quizzes, and rewards are stored in JSON format.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => jsonStorageService.downloadDatabaseJsonFile()}
              className="gap-1.5 text-xs"
            >
              <Download className="w-3.5 h-3.5 text-primary" /> Export Full JSON DB
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowJsonViewer(!showJsonViewer)}
              className="gap-1.5 text-xs"
            >
              <Eye className="w-3.5 h-3.5" /> {showJsonViewer ? 'Hide JSON' : 'Inspect Sign-Ups JSON'}
            </Button>
          </div>
        </div>

        {/* JSON Files Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
          <div className="p-2.5 rounded-xl bg-surface-raised border border-border/40 text-center">
            <p className="text-[11px] text-text-muted font-medium">Users & Sign-ups</p>
            <p className="text-sm font-bold text-text-primary mt-0.5">{registeredUsersCount} Accounts</p>
            <span className="text-[10px] text-primary">users.json / signups.json</span>
          </div>
          <div className="p-2.5 rounded-xl bg-surface-raised border border-border/40 text-center">
            <p className="text-[11px] text-text-muted font-medium">Music Catalog</p>
            <p className="text-sm font-bold text-text-primary mt-0.5">30 Songs • 8 Albums</p>
            <span className="text-[10px] text-primary">songs.json / albums.json</span>
          </div>
          <div className="p-2.5 rounded-xl bg-surface-raised border border-border/40 text-center">
            <p className="text-[11px] text-text-muted font-medium">Trivia & Challenges</p>
            <p className="text-sm font-bold text-text-primary mt-0.5">6 Categories</p>
            <span className="text-[10px] text-primary">quizzes.json</span>
          </div>
          <div className="p-2.5 rounded-xl bg-surface-raised border border-border/40 text-center">
            <p className="text-[11px] text-text-muted font-medium">Gamification & Store</p>
            <p className="text-sm font-bold text-text-primary mt-0.5">VIP Tiers & Badges</p>
            <span className="text-[10px] text-primary">rewards.json</span>
          </div>
        </div>

        {/* Live Sign-up JSON Viewer */}
        {showJsonViewer && (
          <div className="mt-3 p-3.5 rounded-xl bg-surface-overlay border border-border/60 font-mono text-[11px] max-h-72 overflow-y-auto">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-border/40">
              <span className="text-text-primary font-bold">src/data/signups.json (Live Recorded Sign-Ups)</span>
              <span className="text-text-muted text-[10px]">{signupsList.length} total entries</span>
            </div>
            <pre className="text-emerald-400 dark:text-emerald-300 overflow-x-auto whitespace-pre">
              {JSON.stringify(signupsList, null, 2)}
            </pre>
          </div>
        )}
      </Card>

      {/* About Application */}
      <Card className="p-6 sm:p-7 shadow-soft-sm space-y-2">
        <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
          <Info className="w-4 h-4 text-primary" /> About TuneQuest
        </h3>
        <p className="text-xs text-text-secondary leading-relaxed max-w-xl">
          TuneQuest — Listen. Play. Earn. Unlock.
          <br />
          Built with React 19, TypeScript, Vite, Tailwind CSS, and Zustand.
          All application collections are stored in portable JSON format in the <code className="text-primary font-semibold">src/data/</code> directory.
        </p>
      </Card>

      {/* Danger Zone */}
      <div className="p-6 sm:p-7 rounded-2xl bg-danger/5 border border-danger/20 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-danger flex items-center gap-2">
            <Trash2 className="w-4 h-4" /> Account Session
          </h3>
          <span className="text-[10px] font-bold text-text-muted bg-surface-secondary px-2 py-0.5 rounded border border-border">
            Demo Only
          </span>
        </div>
        <p className="text-xs text-text-secondary">
          Reset local simulation demo data or sign out of this device.
        </p>
        <div className="flex flex-wrap gap-2.5 pt-1">
          <Button variant="outline" size="sm" onClick={handleResetDemoData}>
            Reset Demo Data
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={async () => {
              await logout();
              navigate('/login');
            }}
          >
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
};
