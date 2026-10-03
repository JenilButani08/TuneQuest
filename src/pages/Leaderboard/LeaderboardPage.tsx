import React, { useEffect, useState } from 'react';
import { Trophy, Flame, ShieldCheck, Coins, Users, Calendar, Crown, Medal } from 'lucide-react';
import { leaderboardService } from '../../services/user/userService';
import { LeaderboardEntry, LeaderboardTimeframe } from '../../types';
import { Badge } from '../../components/ui/Badge';
import { LeaderboardSkeleton } from '../../components/ui/Skeleton';

export const LeaderboardPage: React.FC = () => {
  const [timeframe, setTimeframe] = useState<LeaderboardTimeframe>('weekly');
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    leaderboardService.getLeaderboard(timeframe).then((data) => {
      setEntries(data);
      setLoading(false);
    });
  }, [timeframe]);

  const getRankBadge = (rank: number) => {
    if (rank === 1) return <Crown className="w-5 h-5 text-amber-400" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-slate-300" />;
    if (rank === 3) return <Medal className="w-5 h-5 text-amber-700" />;
    return <span className="font-mono text-sm font-bold text-slate-500">#{rank}</span>;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-white flex items-center gap-3">
            <Trophy className="w-8 h-8 text-amber-400" /> Music Masters Leaderboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Top music trivia champions ranked by points, quiz scores, and daily streaks.
          </p>
        </div>

        {/* Timeframe Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-surface border border-slate-800 rounded-2xl w-fit">
          {(['weekly', 'monthly', 'all-time', 'friends'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTimeframe(t)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize transition-all ${
                timeframe === t
                  ? 'bg-purple-600 text-white shadow-glow-primary/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t.replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Top 3 Podium (for weekly and monthly) */}
      {!loading && entries.length >= 3 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* Rank 2 */}
          <div className="order-2 md:order-1 glass-card p-6 rounded-3xl border-slate-800 text-center flex flex-col items-center justify-center space-y-3">
            <span className="text-xs font-bold text-slate-400">2nd Place</span>
            <div className="relative">
              <img
                src={entries[1].avatarUrl}
                alt={entries[1].username}
                className="w-20 h-20 rounded-full object-cover border-2 border-slate-400 shadow-lg"
              />
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-slate-800 text-[10px] font-bold text-slate-300 border border-slate-600">
                #2
              </span>
            </div>
            <div>
              <p className="font-bold text-white text-base">{entries[1].displayName}</p>
              <p className="text-xs text-slate-400">@{entries[1].username}</p>
            </div>
            <div className="flex items-center gap-3 text-xs pt-1">
              <span className="font-bold text-amber-400">{entries[1].tunePoints} TP</span>
              <span className="text-slate-500">•</span>
              <span className="text-orange-400 font-bold flex items-center gap-1">
                <Flame className="w-3.5 h-3.5" /> {entries[1].streak}d
              </span>
            </div>
          </div>

          {/* Rank 1 - Center Tall */}
          <div className="order-1 md:order-2 glass-panel p-6 sm:p-8 rounded-3xl border-amber-500/50 text-center flex flex-col items-center justify-center space-y-3 shadow-glow-points/30 bg-gradient-to-b from-amber-950/20 to-transparent scale-105">
            <div className="flex items-center gap-1 text-xs font-bold text-amber-400">
              <Crown className="w-4 h-4" /> Grand Champion
            </div>
            <div className="relative">
              <img
                src={entries[0].avatarUrl}
                alt={entries[0].username}
                className="w-24 h-24 rounded-full object-cover border-4 border-amber-400 shadow-2xl"
              />
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-amber-500 text-[10px] font-bold text-slate-950">
                #1
              </span>
            </div>
            <div>
              <p className="font-bold text-white text-lg">{entries[0].displayName}</p>
              <p className="text-xs text-slate-400">@{entries[0].username}</p>
            </div>
            <div className="flex items-center gap-3 text-xs pt-1">
              <span className="font-bold text-amber-400 text-sm font-mono">{entries[0].tunePoints} TP</span>
              <span className="text-slate-500">•</span>
              <span className="text-orange-400 font-bold flex items-center gap-1">
                <Flame className="w-4 h-4" /> {entries[0].streak}d
              </span>
            </div>
          </div>

          {/* Rank 3 */}
          <div className="order-3 glass-card p-6 rounded-3xl border-slate-800 text-center flex flex-col items-center justify-center space-y-3">
            <span className="text-xs font-bold text-amber-600">3rd Place</span>
            <div className="relative">
              <img
                src={entries[2].avatarUrl}
                alt={entries[2].username}
                className="w-20 h-20 rounded-full object-cover border-2 border-amber-700 shadow-lg"
              />
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-slate-800 text-[10px] font-bold text-amber-600 border border-amber-800">
                #3
              </span>
            </div>
            <div>
              <p className="font-bold text-white text-base">{entries[2].displayName}</p>
              <p className="text-xs text-slate-400">@{entries[2].username}</p>
            </div>
            <div className="flex items-center gap-3 text-xs pt-1">
              <span className="font-bold text-amber-400">{entries[2].tunePoints} TP</span>
              <span className="text-slate-500">•</span>
              <span className="text-orange-400 font-bold flex items-center gap-1">
                <Flame className="w-3.5 h-3.5" /> {entries[2].streak}d
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Main Leaderboard Table */}
      <div className="glass-panel rounded-3xl border border-white/5 overflow-hidden">
        <div className="grid grid-cols-12 gap-4 px-6 py-3.5 border-b border-white/5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          <span className="col-span-1 text-center">Rank</span>
          <span className="col-span-6 sm:col-span-5">User</span>
          <span className="col-span-2 hidden sm:block text-center">Level</span>
          <span className="col-span-3 sm:col-span-2 text-right">TunePoints</span>
          <span className="col-span-2 text-right">Streak</span>
        </div>

        {loading ? (
          <div className="p-6">
            <LeaderboardSkeleton />
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {entries.map((entry) => (
              <div
                key={entry.userId}
                className={`grid grid-cols-12 gap-4 items-center px-6 py-3.5 text-xs transition-colors ${
                  entry.isCurrentUser
                    ? 'bg-purple-950/40 border-y border-purple-500/40 font-semibold'
                    : 'hover:bg-white/5'
                }`}
              >
                <div className="col-span-1 flex items-center justify-center">
                  {getRankBadge(entry.rank)}
                </div>

                <div className="col-span-6 sm:col-span-5 flex items-center gap-3 min-w-0">
                  <img
                    src={entry.avatarUrl}
                    alt={entry.username}
                    className="w-9 h-9 rounded-full object-cover border border-white/10 flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <p className={`truncate font-semibold ${entry.isCurrentUser ? 'text-purple-300' : 'text-white'}`}>
                      {entry.displayName} {entry.isCurrentUser && '(You)'}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">@{entry.username}</p>
                  </div>
                </div>

                <div className="col-span-2 hidden sm:flex items-center justify-center">
                  <span className="px-2 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-700/40 text-cyan-300 text-[10px] font-semibold">
                    Lvl {entry.level}
                  </span>
                </div>

                <div className="col-span-3 sm:col-span-2 text-right font-mono font-bold text-amber-400">
                  {entry.tunePoints.toLocaleString()} TP
                </div>

                <div className="col-span-2 flex items-center justify-end gap-1 text-orange-400 font-bold">
                  <Flame className="w-3.5 h-3.5" />
                  <span>{entry.streak}d</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
