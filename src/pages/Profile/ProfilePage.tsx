import React, { useState } from 'react';
import {
  User as UserIcon,
  ShieldCheck,
  Coins,
  Flame,
  Award,
  Sparkles,
  Check,
  FolderHeart,
  Headphones,
  CheckCircle2,
  Gift,
  Copy,
  Share2,
  Edit3,
  Upload,
  Percent,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useWalletStore } from '../../store/walletStore';
import { useUIStore } from '../../store/uiStore';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import { Link } from 'react-router-dom';

const PREDEFINED_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=300&auto=format&fit=crop&q=80',
];

export const ProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuthStore();
  const { wallet } = useWalletStore();
  const { addToast } = useUIStore();

  const [copied, setCopied] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Edit form state
  const [editFullName, setEditFullName] = useState('');
  const [editUsername, setEditUsername] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editAvatar, setEditAvatar] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  if (!user) return null;

  const referralCode = user.referralCode || 'TUNE-A7K92X';
  const referralLink = `${window.location.origin}/register?ref=${referralCode}`;

  const handleOpenEdit = () => {
    setEditFullName(user.fullName || user.displayName || '');
    setEditUsername(user.username || '');
    setEditBio(user.bio || '');
    setEditAvatar(user.avatar || user.avatarUrl || PREDEFINED_AVATARS[0]);
    setIsEditModalOpen(true);
  };

  const handleAvatarFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        addToast({
          type: 'error',
          title: 'File Too Large',
          message: 'Please choose an image under 2MB.',
        });
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setEditAvatar(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editFullName.trim()) {
      addToast({
        type: 'error',
        title: 'Validation Error',
        message: 'Full Name cannot be empty.',
      });
      return;
    }

    setIsSaving(true);
    const success = await updateProfile({
      fullName: editFullName.trim(),
      displayName: editFullName.trim(),
      username: editUsername.trim() || user.username,
      bio: editBio.trim(),
      avatar: editAvatar,
      avatarUrl: editAvatar,
    });
    setIsSaving(false);

    if (success) {
      addToast({
        type: 'success',
        title: 'Profile Updated',
        message: 'Profile updated successfully.',
      });
      setIsEditModalOpen(false);
    }
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(referralCode);
      setCopied(true);
      addToast({
        type: 'success',
        title: 'Referral Code Copied',
        message: 'Referral code copied to clipboard!',
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      addToast({
        type: 'error',
        title: 'Copy Failed',
        message: 'Could not copy code.',
      });
    }
  };

  const handleShare = async () => {
    const shareMessage = `Join me on TuneQuest and earn 50 TunePoints! Use my referral code: ${referralCode}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'TuneQuest — Listen. Play. Earn. Unlock.',
          text: shareMessage,
          url: referralLink,
        });
        addToast({
          type: 'success',
          title: 'Shared!',
          message: 'Referral link shared successfully.',
        });
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          copyLinkFallback();
        }
      }
    } else {
      copyLinkFallback();
    }
  };

  const copyLinkFallback = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      addToast({
        type: 'success',
        title: 'Link Copied',
        message: 'Referral link copied to clipboard!',
      });
    } catch {
      addToast({
        type: 'error',
        title: 'Copy Failed',
        message: 'Unable to copy link.',
      });
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Profile Header Card */}
      <Card className="p-6 sm:p-8 shadow-soft-sm">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left">
          <div className="relative">
            <img
              src={user.avatarUrl || user.avatar}
              alt={user.displayName}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border border-border shadow-soft-sm"
            />
            <span className="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-full bg-primary text-[11px] font-bold text-white shadow-soft-sm">
              Lvl {user.level}
            </span>
          </div>

          <div className="flex-1 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">
                  {user.fullName || user.displayName}
                </h1>
                <p className="text-xs sm:text-sm text-text-secondary">
                  @{user.username} • Joined {new Date(user.createdAt || Date.now()).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                </p>
                {user.bio && (
                  <p className="text-xs text-text-secondary/90 mt-1 max-w-xl italic">
                    "{user.bio}"
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Button variant="primary" size="sm" onClick={handleOpenEdit}>
                  <Edit3 className="w-3.5 h-3.5 mr-1.5" /> Edit Profile
                </Button>
                <Link to="/settings">
                  <Button variant="outline" size="sm">
                    Settings
                  </Button>
                </Link>
              </div>
            </div>

            {/* Premium Discount Banner (if active) */}
            {user.premiumDiscount ? (
              <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 flex items-center gap-2.5 text-xs text-primary font-semibold w-fit">
                <Percent className="w-4 h-4 text-primary" />
                <span>Your Premium Discount: <strong>{user.premiumDiscount}% OFF</strong></span>
              </div>
            ) : null}

            {/* Favorite Genres */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-1">
              {user.favoriteGenres.map((genre) => (
                <span
                  key={genre}
                  className="px-2.5 py-1 rounded-full bg-surface-secondary border border-border text-[11px] font-semibold text-text-secondary"
                >
                  {genre}
                </span>
              ))}
            </div>

            {/* Level XP Bar */}
            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between text-xs font-semibold text-text-secondary">
                <span>Music Explorer (Level {user.level})</span>
                <span className="font-mono">{user.xp} / {user.xpToNextLevel || 2000} XP</span>
              </div>
              <ProgressBar value={(user.xp / (user.xpToNextLevel || 2000)) * 100} variant="xp" size="md" />
            </div>
          </div>
        </div>
      </Card>

      {/* Section: EDIT PROFILE MODAL */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Profile"
        description="Update your personal public profile details. TunePoints, level, and streaks are earned through gameplay."
      >
        <form onSubmit={handleSaveProfile} className="space-y-4">
          {/* Avatar Selector */}
          <div>
            <label className="block text-xs font-semibold text-text-primary mb-2">Profile Image</label>
            <div className="flex items-center gap-4 mb-3">
              <img
                src={editAvatar}
                alt="Selected avatar"
                className="w-16 h-16 rounded-2xl object-cover border-2 border-primary shadow-soft-sm"
              />
              <div className="space-y-1 flex-1">
                <p className="text-xs text-text-secondary">Choose a predefined avatar or upload custom photo</p>
                <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-surface-secondary hover:bg-border/60 text-xs text-text-primary cursor-pointer transition-colors">
                  <Upload className="w-3.5 h-3.5 text-primary" />
                  <span>Upload Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1">
              {PREDEFINED_AVATARS.map((url, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setEditAvatar(url)}
                  className={`w-10 h-10 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 cursor-pointer ${
                    editAvatar === url ? 'border-primary ring-2 ring-primary/30' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={url} alt={`Avatar option ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-text-primary mb-1">Full Name</label>
            <input
              type="text"
              value={editFullName}
              onChange={(e) => setEditFullName(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 bg-surface-secondary border border-border rounded-xl text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              placeholder="e.g. Alex Rivers"
            />
          </div>

          {/* Username */}
          <div>
            <label className="block text-xs font-semibold text-text-primary mb-1">Username</label>
            <input
              type="text"
              value={editUsername}
              onChange={(e) => setEditUsername(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 bg-surface-secondary border border-border rounded-xl text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              placeholder="e.g. MusicExplorer"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-xs font-semibold text-text-primary mb-1">Bio</label>
            <textarea
              rows={2}
              value={editBio}
              onChange={(e) => setEditBio(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-surface-secondary border border-border rounded-xl text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
              placeholder="Tell others what music you love..."
            />
          </div>

          {/* Readonly Info notice */}
          <div className="p-3 rounded-xl bg-surface-secondary/70 border border-border text-[11px] text-text-muted">
            🛡️ <strong>Gameplay Stats Protected:</strong> TunePoints ({user.tunePoints} TP), Level {user.level}, XP ({user.xp}), and Streak ({user.streak}d) are verified from game activity and cannot be altered manually.
          </div>

          <div className="flex gap-2.5 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => setIsEditModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex-1"
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Section 57: YOUR REFERRAL SECTION */}
      <Card className="p-6 shadow-soft-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
              <Gift className="w-5 h-5 text-primary" /> Your Referral
            </h3>
            <p className="text-xs text-text-secondary mt-0.5">
              Share your code to earn 100 TP when friends register.
            </p>
          </div>
          <Link to="/referrals" className="text-xs font-semibold text-primary hover:underline">
            View Full Referral Dashboard →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          <div className="p-3.5 rounded-xl bg-surface-secondary border border-border text-center sm:text-left">
            <span className="text-[11px] text-text-muted block">Referral Code</span>
            <span className="font-mono text-lg font-bold text-text-primary tracking-wider">
              {referralCode}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-surface-secondary border border-border text-center sm:text-left">
            <span className="text-[11px] text-text-muted block">Friends Referred</span>
            <span className="text-lg font-bold text-text-primary">
              {user.stats?.friendsReferred || (user.id === 'usr_music_explorer_01' ? 5 : 0)}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-surface-secondary border border-border text-center sm:text-left">
            <span className="text-[11px] text-text-muted block">TunePoints Earned</span>
            <span className="text-lg font-bold text-primary">
              {((user.stats?.friendsReferred || (user.id === 'usr_music_explorer_01' ? 5 : 0))) * 100} TP
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="primary" size="sm" onClick={handleCopyCode}>
            {copied ? (
              <>
                <Check className="w-4 h-4 mr-1.5" /> Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-1.5" /> Copy Code
              </>
            )}
          </Button>
          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share2 className="w-4 h-4 mr-1.5" /> Share
          </Button>
        </div>
      </Card>

      {/* Streak Calendar */}
      <Card className="p-6 shadow-soft-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
              <Flame className="w-5 h-5 text-warning" /> Daily Challenge Streak
            </h3>
            <p className="text-xs text-text-secondary">
              You're on a {user.streak}-day streak! Keep it going to earn bonus points.
            </p>
          </div>
          <span className="text-xs font-bold text-warning bg-warning/10 px-3 py-1 rounded-full border border-warning/20">
            {user.streak} Days Active
          </span>
        </div>

        <div className="grid grid-cols-7 gap-2 pt-2">
          {(user.streakCalendar || []).map((item) => (
            <div
              key={item.day}
              className={`p-3 rounded-xl text-center border flex flex-col items-center justify-center transition-all ${
                item.isToday
                  ? 'bg-primary/10 border-primary text-primary font-bold'
                  : item.completed
                  ? 'bg-surface-secondary border-border text-warning'
                  : 'bg-surface-secondary/40 border-border text-text-muted'
              }`}
            >
              <span className="text-xs uppercase">{item.dayShort}</span>
              <div className="w-5 h-5 rounded-full flex items-center justify-center mt-2">
                {item.completed ? (
                  <Check className="w-3.5 h-3.5 text-warning" />
                ) : item.isToday ? (
                  <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-border" />
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Career Metrics */}
      <section className="space-y-4">
        <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" /> Career Statistics
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <Card className="p-4 text-center shadow-soft-sm">
            <Coins className="w-5 h-5 text-primary mx-auto mb-1.5" />
            <span className="text-[10px] text-text-muted uppercase font-semibold">TunePoints</span>
            <p className="text-lg font-bold text-text-primary mt-0.5">
              {wallet.balance.toLocaleString()}
            </p>
          </Card>

          <Card className="p-4 text-center shadow-soft-sm">
            <Award className="w-5 h-5 text-primary mx-auto mb-1.5" />
            <span className="text-[10px] text-text-muted uppercase font-semibold">Quizzes Done</span>
            <p className="text-lg font-bold text-text-primary mt-0.5">
              {user.stats?.quizzesCompleted || 0}
            </p>
          </Card>

          <Card className="p-4 text-center shadow-soft-sm">
            <CheckCircle2 className="w-5 h-5 text-success mx-auto mb-1.5" />
            <span className="text-[10px] text-text-muted uppercase font-semibold">Accuracy</span>
            <p className="text-lg font-bold text-success mt-0.5">
              {user.stats?.accuracyPercent || 80}%
            </p>
          </Card>

          <Card className="p-4 text-center shadow-soft-sm">
            <Headphones className="w-5 h-5 text-primary mx-auto mb-1.5" />
            <span className="text-[10px] text-text-muted uppercase font-semibold">Songs Streamed</span>
            <p className="text-lg font-bold text-text-primary mt-0.5">
              {user.stats?.songsPlayed || 0}
            </p>
          </Card>

          <Card className="p-4 text-center shadow-soft-sm">
            <FolderHeart className="w-5 h-5 text-primary mx-auto mb-1.5" />
            <span className="text-[10px] text-text-muted uppercase font-semibold">Playlists</span>
            <p className="text-lg font-bold text-text-primary mt-0.5">
              {user.stats?.playlistsCreated || 0}
            </p>
          </Card>
        </div>
      </section>
    </div>
  );
};
