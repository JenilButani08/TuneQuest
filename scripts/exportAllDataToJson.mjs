import { createServer } from 'vite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const dataDir = path.resolve(rootDir, 'src', 'data');

async function exportAll() {
  console.log('Initializing Vite SSR environment to convert all app data to JSON...');
  const server = await createServer({
    root: rootDir,
    server: { middlewareMode: true },
    appType: 'custom',
  });

  try {
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // 1. Users & Sign-Up Data
    const usersMod = await server.ssrLoadModule('/src/mock/users.ts');
    const usersData = {
      currentUser: usersMod.mockCurrentUser,
      registeredUsers: [
        {
          id: usersMod.mockCurrentUser.id,
          username: usersMod.mockCurrentUser.username,
          displayName: usersMod.mockCurrentUser.displayName,
          email: usersMod.mockCurrentUser.email,
          avatarUrl: usersMod.mockCurrentUser.avatarUrl,
          level: usersMod.mockCurrentUser.level,
          tunePoints: usersMod.mockCurrentUser.tunePoints,
          streak: usersMod.mockCurrentUser.streak,
          referralCode: usersMod.mockCurrentUser.referralCode,
          favoriteGenres: usersMod.mockCurrentUser.favoriteGenres,
          subscription: usersMod.mockCurrentUser.subscription,
          stats: usersMod.mockCurrentUser.stats,
          createdAt: usersMod.mockCurrentUser.createdAt,
          passwordHint: 'demo123',
          role: 'user',
        },
        {
          id: 'usr_music_listener_02',
          username: 'BeatSeeker',
          displayName: 'Elena Rostova',
          email: 'elena@tunequest.app',
          avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80',
          level: 5,
          tunePoints: 890,
          streak: 4,
          referralCode: 'TUNE-B9X4L1',
          favoriteGenres: ['Lo-fi Chill', 'Ambient'],
          subscription: { tier: 'free', features: ['Standard Audio (160kbps)'] },
          stats: {
            quizzesCompleted: 31,
            correctAnswers: 142,
            accuracyPercent: 78,
            songsPlayed: 210,
            playlistsCreated: 3,
            timeListenedMinutes: 1200,
            friendsReferred: 2,
          },
          createdAt: '2025-01-20T14:30:00Z',
          passwordHint: 'demo123',
          role: 'user',
        },
        {
          id: 'usr_music_listener_03',
          username: 'NeonRider',
          displayName: 'Marcus Vance',
          email: 'marcus@tunequest.app',
          avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
          level: 12,
          tunePoints: 3450,
          streak: 19,
          referralCode: 'TUNE-N3O8N9',
          favoriteGenres: ['Synthwave', 'Cyber Electro'],
          subscription: { tier: 'vip', features: ['Hi-Fi Audio (320kbps)', 'Zero Ads', 'Double TunePoints'] },
          stats: {
            quizzesCompleted: 98,
            correctAnswers: 440,
            accuracyPercent: 91,
            songsPlayed: 890,
            playlistsCreated: 12,
            timeListenedMinutes: 4500,
            friendsReferred: 9,
          },
          createdAt: '2024-11-10T08:00:00Z',
          passwordHint: 'demo123',
          role: 'vip_user',
        }
      ],
      signUpSchema: {
        fields: ['fullName', 'email', 'password', 'confirmPassword', 'referralCode', 'favoriteGenres'],
        defaultStartingTunePoints: 0,
        referralBonusTunePoints: 50,
        initialLevel: 1,
        initialStreak: 1
      }
    };
    fs.writeFileSync(path.join(dataDir, 'users.json'), JSON.stringify(usersData, null, 2), 'utf-8');
    console.log('✓ Created users.json (accounts, sign-up records, currentUser)');

    // 2. Songs Data
    const songsMod = await server.ssrLoadModule('/src/mock/songs.ts');
    fs.writeFileSync(path.join(dataDir, 'songs.json'), JSON.stringify(songsMod.mockSongs, null, 2), 'utf-8');
    console.log(`✓ Created songs.json (${songsMod.mockSongs.length} songs)`);

    // 3. Albums Data
    const albumsMod = await server.ssrLoadModule('/src/mock/albums.ts');
    fs.writeFileSync(path.join(dataDir, 'albums.json'), JSON.stringify(albumsMod.mockAlbums, null, 2), 'utf-8');
    console.log(`✓ Created albums.json (${albumsMod.mockAlbums.length} albums)`);

    // 4. Artists Data
    const artistsMod = await server.ssrLoadModule('/src/mock/artists.ts');
    fs.writeFileSync(path.join(dataDir, 'artists.json'), JSON.stringify(artistsMod.mockArtists, null, 2), 'utf-8');
    console.log(`✓ Created artists.json (${artistsMod.mockArtists.length} artists)`);

    // 5. Playlists Data
    const playlistsMod = await server.ssrLoadModule('/src/mock/playlists.ts');
    fs.writeFileSync(path.join(dataDir, 'playlists.json'), JSON.stringify(playlistsMod.mockPlaylists, null, 2), 'utf-8');
    console.log(`✓ Created playlists.json (${playlistsMod.mockPlaylists.length} playlists)`);

    // 6. Genres & Moods Data
    const genresMod = await server.ssrLoadModule('/src/mock/genres.ts');
    const genresData = {
      genres: genresMod.mockGenres,
      activities: genresMod.mockActivities
    };
    fs.writeFileSync(path.join(dataDir, 'genres.json'), JSON.stringify(genresData, null, 2), 'utf-8');
    console.log('✓ Created genres.json (genres & mood activities)');

    // 7. Quizzes Data
    const quizzesMod = await server.ssrLoadModule('/src/mock/quizzes.ts');
    const quizzesData = {
      categories: quizzesMod.mockQuizCategories,
      questions: quizzesMod.mockQuestions,
      dailyChallenges: quizzesMod.mockDailyChallengeQuestions
    };
    fs.writeFileSync(path.join(dataDir, 'quizzes.json'), JSON.stringify(quizzesData, null, 2), 'utf-8');
    console.log('✓ Created quizzes.json (categories, questions, daily challenges)');

    // 8. Rewards & Wallet Data
    const rewardsMod = await server.ssrLoadModule('/src/mock/rewards.ts');
    const rewardsData = {
      wallet: rewardsMod.mockWallet,
      rewards: rewardsMod.mockRewards,
      transactions: rewardsMod.mockTransactions,
      tiers: [
        { id: 'tier-bronze', name: 'Bronze Explorer', minPoints: 0, multiplier: 1.0 },
        { id: 'tier-silver', name: 'Silver Virtuoso', minPoints: 1000, multiplier: 1.2 },
        { id: 'tier-gold', name: 'Gold Maestro', minPoints: 3000, multiplier: 1.5 },
        { id: 'tier-diamond', name: 'Diamond Legend', minPoints: 10000, multiplier: 2.0 }
      ]
    };
    fs.writeFileSync(path.join(dataDir, 'rewards.json'), JSON.stringify(rewardsData, null, 2), 'utf-8');
    console.log('✓ Created rewards.json (catalog items, wallet balance, transactions, tiers)');

    // 9. Leaderboard Data
    const leaderboardMod = await server.ssrLoadModule('/src/mock/leaderboard.ts');
    fs.writeFileSync(path.join(dataDir, 'leaderboard.json'), JSON.stringify(leaderboardMod.mockLeaderboardData, null, 2), 'utf-8');
    console.log('✓ Created leaderboard.json (global, weekly, streak ranks)');

    // 10. Achievements Data
    const achievementsMod = await server.ssrLoadModule('/src/mock/achievements.ts');
    fs.writeFileSync(path.join(dataDir, 'achievements.json'), JSON.stringify(achievementsMod.mockAchievements, null, 2), 'utf-8');
    console.log('✓ Created achievements.json (badges and rewards)');

    // 11. Referrals Data
    const referralsData = {
      referrerBonusPoints: 100,
      refereeBonusPoints: 50,
      activeReferralCode: 'TUNE-A7K92X',
      shareUrlBase: 'https://tunequest.app/register?ref=',
      howItWorks: [
        { step: 1, title: 'Share Your Link', description: 'Invite friends using your unique referral code or link.' },
        { step: 2, title: 'Friend Signs Up', description: 'They get +50 TunePoints instantly upon registration.' },
        { step: 3, title: 'Earn +100 TP', description: 'You receive +100 TunePoints as soon as their account is verified.' }
      ],
      recentReferrals: [
        { id: 'ref-1', friendName: 'Samira Khan', status: 'Completed', date: '2025-02-24', pointsEarned: 100 },
        { id: 'ref-2', friendName: 'David Chen', status: 'Completed', date: '2025-02-21', pointsEarned: 100 },
        { id: 'ref-3', friendName: 'Chloe Taylor', status: 'Pending First Quiz', date: '2025-02-18', pointsEarned: 100 }
      ]
    };
    fs.writeFileSync(path.join(dataDir, 'referrals.json'), JSON.stringify(referralsData, null, 2), 'utf-8');
    console.log('✓ Created referrals.json');

    // 12. Home Page Dynamic Config Data
    const homeData = {
      heroEditorial: {
        tagline: 'Staff Curated Spotlight',
        badge: 'Featured Release',
        title: 'Neon Odyssey',
        artist: 'Solaris Wave',
        description: 'A 1980s synth dreamscape woven with lush analog chorus, arpeggiated Moog basslines, and glistening tape warmth.',
        genre: 'Synthwave',
        songId: 'song-1',
        coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80'
      },
      dailyChallengePrompt: {
        title: 'Daily Music Challenge',
        description: '3 audio snippets, 10 seconds each. Can you maintain your 7-day streak and earn +50 TunePoints?',
        bonusTunePoints: 50,
        bonusXp: 25,
        estimatedTimeMinutes: 2
      },
      rewardsBanner: {
        title: 'Earn While You Listen',
        description: 'Complete daily music trivia, keep your streak alive, and redeem points for VIP passes and exclusive audio presets.',
        currentPointsLabel: '1,240 TunePoints Available'
      }
    };
    fs.writeFileSync(path.join(dataDir, 'homeData.json'), JSON.stringify(homeData, null, 2), 'utf-8');
    console.log('✓ Created homeData.json');

    // 13. Application Configuration & Settings Data
    const appConfig = {
      appName: 'TuneQuest',
      version: '1.0.0',
      description: 'Production-ready gamified music streaming platform',
      audioSettings: {
        supportedBitrates: ['128kbps', '160kbps', '320kbps Lossless'],
        defaultBitrate: '320kbps Lossless',
        volumeDefault: 0.8,
        crossfadeSeconds: 2
      },
      gamificationRules: {
        pointsPerCorrectQuiz: 10,
        xpPerCorrectQuiz: 15,
        dailyChallengeBonus: 50,
        sevenDayStreakBonus: 200,
        referralInviterPoints: 100,
        referralInviteePoints: 50
      },
      themeSettings: {
        defaultMode: 'system',
        modesSupported: ['light', 'dark', 'system'],
        defaultAccentColor: 'primary'
      }
    };
    fs.writeFileSync(path.join(dataDir, 'appConfig.json'), JSON.stringify(appConfig, null, 2), 'utf-8');
    console.log('✓ Created appConfig.json');

    console.log('\n🎉 ALL FULL WEB APP DATA SUCCESSFULLY STORED IN JSON FORMAT IN folder: src/data/');
  } finally {
    await server.close();
  }
}

exportAll().catch(err => {
  console.error('Export error:', err);
  process.exit(1);
});
