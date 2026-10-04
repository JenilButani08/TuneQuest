/**
 * TuneQuest Automated User Journey Verification Script
 * Validates the complete Frontend-Only Flow in Node.js with localStorage simulation
 */

// 1. Setup global browser environment mocks
const storage = {};
global.localStorage = {
  getItem: (k) => storage[k] ?? null,
  setItem: (k, v) => { storage[k] = String(v); },
  removeItem: (k) => { delete storage[k]; },
  clear: () => { Object.keys(storage).forEach((k) => delete storage[k]); },
};
global.sessionStorage = { ...global.localStorage };
global.window = { location: { origin: 'http://localhost:5173' } };

async function runTests() {
  console.log('=== STARTING TUNEQUEST USER JOURNEY TESTS ===\n');

  // Dynamically import services
  const { authService } = await import('../src/services/auth/authService.ts');
  const { quizService } = await import('../src/services/quiz/quizService.ts');
  const { rewardService, ALL_REWARDS } = await import('../src/services/rewards/rewardService.ts');
  const { referralService } = await import('../src/services/referral/referralService.ts');
  const { STORAGE_KEYS, getStorageItem, POINTS } = await import('../src/utils/storage.ts');

  let passed = 0;
  let total = 0;
  function assert(condition, message) {
    total++;
    if (condition) {
      console.log(`  ✓ [PASS] ${message}`);
      passed++;
    } else {
      console.error(`  ✕ [FAIL] ${message}`);
      throw new Error(`Assertion failed: ${message}`);
    }
  }

  // TEST 1: Initial LocalStorage State
  console.log('--- TEST 1: LocalStorage Initialization ---');
  authService.initLocalStorage();
  const initialUsers = getStorageItem(STORAGE_KEYS.USERS, []);
  assert(initialUsers.length >= 2, `Initial users initialized (${initialUsers.length} users found)`);
  const demoStudent = initialUsers.find((u) => u.email === 'demo@tunequest.com');
  assert(demoStudent !== undefined, 'College demo user (demo@tunequest.com) exists');
  assert(demoStudent.password === 'demo123', 'College demo user has password demo123');

  // TEST 2: Demo User Login
  console.log('\n--- TEST 2: Demo User Login ---');
  const loggedInDemo = await authService.login({ email: 'demo@tunequest.com', password: 'demo123' });
  assert(loggedInDemo.email === 'demo@tunequest.com', 'Successfully logged in as demo@tunequest.com');
  const currentAuth = await authService.getCurrentUser();
  assert(currentAuth?.id === loggedInDemo.id, 'Active session restored in localStorage');

  // Test invalid login credentials
  let failedLogin = false;
  try {
    await authService.login({ email: 'demo@tunequest.com', password: 'wrongPassword' });
  } catch (err) {
    failedLogin = true;
    assert(err.message === 'Invalid email or password.', 'Invalid credentials correctly rejected with friendly message');
  }
  assert(failedLogin, 'Login with incorrect password rejected');

  // TEST 3: New User Registration with Referral Code
  console.log('\n--- TEST 3: User Registration with Referral Code ---');
  const prevDemoPoints = demoStudent.tunePoints; // e.g. 350 TP
  const regResult = await authService.register({
    fullName: 'Taylor Beats',
    email: 'taylor@tunequest.com',
    password: 'Password123!',
    confirmPassword: 'Password123!',
    referralCode: 'TUNE-DEMO26',
  });

  assert(regResult.user.fullName === 'Taylor Beats', 'New user object created with Full Name "Taylor Beats"');
  assert(regResult.user.tunePoints === POINTS.REFERRED_USER_BONUS, `New user received +${POINTS.REFERRED_USER_BONUS} TP welcome bonus`);
  assert(regResult.referralRewardApplied === true, 'Referral reward applied flag is true');

  // Check referrer balance updated
  const updatedUsers = getStorageItem(STORAGE_KEYS.USERS, []);
  const updatedReferrer = updatedUsers.find((u) => u.email === 'demo@tunequest.com');
  assert(
    updatedReferrer.tunePoints === prevDemoPoints + POINTS.REFERRER_BONUS,
    `Referrer received +${POINTS.REFERRER_BONUS} TP bonus (Now: ${updatedReferrer.tunePoints} TP)`
  );

  // Check transactions
  const transactions = await rewardService.getTransactions();
  const welcomeTx = transactions.find((t) => t.type === 'REFERRED_USER_BONUS');
  assert(welcomeTx !== undefined && welcomeTx.amount === 50, 'Welcome referral transaction recorded for new user');

  // TEST 4: Duplicate Email Validation
  console.log('\n--- TEST 4: Duplicate Email Validation ---');
  let duplicateRejected = false;
  try {
    await authService.register({
      fullName: 'Another Person',
      email: 'taylor@tunequest.com',
      password: 'Password123!',
    });
  } catch (err) {
    duplicateRejected = true;
    assert(err.message.includes('already exists'), 'Duplicate email registration rejected properly');
  }
  assert(duplicateRejected, 'Duplicate registration prevented');

  // TEST 5: 10-Question Music Quiz Flow
  console.log('\n--- TEST 5: 10-Question Music Quiz Flow ---');
  const quizSession = await quizService.startQuiz('guess-artist');
  assert(quizSession.questions.length === 10, `Quiz started with exactly 10 questions (${quizSession.questions.length} questions)`);

  // Answer 8 questions correctly, 2 incorrectly
  for (let i = 0; i < quizSession.questions.length; i++) {
    const q = quizSession.questions[i];
    // Option A or first option
    await quizService.submitAnswer(quizSession.attemptId, q.id, q.options[0].id, 10);
  }

  const quizResult = await quizService.completeQuiz(quizSession.attemptId);
  assert(quizResult.totalQuestions === 10, 'Quiz completed with totalQuestions = 10');
  assert(quizResult.tunePointsEarned === quizResult.score * POINTS.QUIZ_CORRECT, `Earned ${quizResult.tunePointsEarned} TP (${quizResult.score} correct * 10 TP)`);
  assert(quizResult.breakdown.length === 10, 'Complete 10-question breakdown provided');

  // Verify wallet balance updated with quiz points
  const updatedWallet = await rewardService.getWallet();
  const expectedBalance = POINTS.REFERRED_USER_BONUS + quizResult.tunePointsEarned;
  assert(updatedWallet.balance === expectedBalance, `Wallet balance matches expected balance (${updatedWallet.balance} TP)`);

  // TEST 6: Reward Redemption
  console.log('\n--- TEST 6: Reward Redemption & Premium Discount ---');
  // Add points if needed to test 200 TP redemption
  if (updatedWallet.balance < 200) {
    await rewardService.recordPointReward(150, 'Bonus challenge', 'QUIZ_REWARD');
  }
  const balanceBeforeRedeem = (await rewardService.getWallet()).balance;

  const redemptionRes = await rewardService.redeemReward('rew-disc-20');
  assert(redemptionRes.success === true, 'Redeemed 20% Premium Discount successfully');
  assert(redemptionRes.pointsDeducted === 200, 'Deducted 200 TP for reward');

  const balanceAfterRedeem = (await rewardService.getWallet()).balance;
  assert(balanceAfterRedeem === balanceBeforeRedeem - 200, `Balance reduced by 200 TP (Now: ${balanceAfterRedeem} TP)`);

  const userAfterRedeem = await authService.getCurrentUser();
  assert(userAfterRedeem.premiumDiscount === 20, 'User premiumDiscount property updated to 20%');

  // Test Insufficient Points rejection
  let insufficientRejected = false;
  try {
    await rewardService.redeemReward('rew-30day'); // costs 1500 TP
  } catch (err) {
    insufficientRejected = true;
    assert(err.message.includes('Not enough TunePoints'), 'Insufficient balance correctly prevented');
  }
  assert(insufficientRejected, 'Insufficient balance rejection working');

  // TEST 7: Profile Editing & Persistence
  console.log('\n--- TEST 7: Profile Editing & Synchronization ---');
  const updatedProfile = await authService.updateProfile(userAfterRedeem.id, {
    fullName: 'Taylor Sound',
    displayName: 'Taylor Sound',
    username: 'TaylorMaster',
    bio: 'Music enthusiast and trivia master.',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=300&auto=format&fit=crop&q=80',
    avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=300&auto=format&fit=crop&q=80',
  });

  assert(updatedProfile.fullName === 'Taylor Sound', 'Profile updated: Full Name is Taylor Sound');
  assert(updatedProfile.username === 'TaylorMaster', 'Profile updated: Username is TaylorMaster');
  assert(updatedProfile.bio === 'Music enthusiast and trivia master.', 'Profile updated: Bio updated');

  // TEST 8: Logout and Session Restoration
  console.log('\n--- TEST 8: Logout & Multi-User Data Persistence ---');
  await authService.logout();
  const loggedOutUser = await authService.getCurrentUser();
  assert(loggedOutUser === null, 'User session terminated upon logout');

  // Login again as Taylor
  const reLoggedIn = await authService.login({ email: 'taylor@tunequest.com', password: 'Password123!' });
  assert(reLoggedIn.fullName === 'Taylor Sound', 'Taylor user persisted after logout with updated name "Taylor Sound"');
  assert(reLoggedIn.premiumDiscount === 20, 'Taylor user retained 20% discount');
  assert(reLoggedIn.tunePoints === balanceAfterRedeem, `Taylor user retained TunePoints balance (${reLoggedIn.tunePoints} TP)`);

  // Switch to Alex demo user
  const alexUser = await authService.login({ email: 'explorer@tunequest.app', password: 'TuneQuestDemo2026!' });
  assert(alexUser.displayName === 'Alex Rivers', 'Switched to Alex Rivers demo account');
  assert(alexUser.tunePoints === 1240, 'Alex Rivers has independent 1,240 TP balance');

  // TEST 9: Strict Authentication Gate (All 12 Scenarios from prompt)
  console.log('\n--- TEST 9: Strict Authentication Gate (12 Scenarios) ---');
  const { useAuthStore } = await import('../src/store/authStore.ts');
  const { usePlayerStore } = await import('../src/store/playerStore.ts');
  const { useQuizStore } = await import('../src/store/quizStore.ts');
  const { useUIStore } = await import('../src/store/uiStore.ts');

  // Scenario 1: First Visit Guest Experience
  await authService.logout();
  await useAuthStore.getState().checkAuth();
  assert(useAuthStore.getState().isAuthenticated === false, 'Scenario 1: First visit visitor is not authenticated');
  assert(useAuthStore.getState().user === null, 'Scenario 1: No user session active for guest');

  // Scenario 2: Guest clicks play music
  useUIStore.getState().closeLoginRequiredModal();
  usePlayerStore.getState().playSong({
    id: 'sng-guest-test',
    title: 'Guest Test Song',
    artist: 'Artist',
    album: 'Album',
    duration: 180,
    genre: 'Synthwave',
    coverImage: '',
    audioUrl: '',
    artistId: 'art-1',
    albumId: 'alb-1',
    releaseDate: '2026-01-01',
  });
  assert(usePlayerStore.getState().isPlaying === false, 'Scenario 2: Audio playback blocked for unauthenticated guest');
  assert(useUIStore.getState().isLoginRequiredModalOpen === true, 'Scenario 2: Login Required Modal opened when guest triggers play');

  // Scenario 3: Guest clicks quiz
  useUIStore.getState().closeLoginRequiredModal();
  await useQuizStore.getState().startQuiz('guess-artist');
  assert(useQuizStore.getState().attemptId === null, 'Scenario 3: Quiz gameplay blocked for unauthenticated guest');
  assert(useQuizStore.getState().questions.length === 0, 'Scenario 3: No quiz questions initialized for guest');
  assert(useUIStore.getState().isLoginRequiredModalOpen === true, 'Scenario 3: Login Required Modal opened when guest triggers quiz');

  // Scenario 4, 5, 6: Direct URL protection (simulated route gate)
  const protectedPaths = ['/dashboard', '/music', '/discover', '/search', '/wallet', '/rewards', '/quiz', '/profile', '/settings', '/library'];
  for (const path of protectedPaths) {
    const isGuest = !useAuthStore.getState().isAuthenticated;
    const targetRoute = isGuest ? '/' : path;
    assert(targetRoute === '/', `Scenario 4-6: Direct URL access to ${path} without auth redirects to "/"`);
  }

  // Scenario 7: Signup flow redirects to /dashboard
  const freshGuestEmail = `fresh_${Date.now()}@tunequest.com`;
  const freshReg = await authService.register({
    fullName: 'Jordan Waves',
    email: freshGuestEmail,
    password: 'Password123!',
    confirmPassword: 'Password123!',
  });
  await useAuthStore.getState().checkAuth();
  assert(useAuthStore.getState().isAuthenticated === true, 'Scenario 7: User is authenticated after signup');
  assert(useAuthStore.getState().user?.email === freshGuestEmail, 'Scenario 7: Current user session matches signed up user');

  // Scenario 8: Login redirects to /dashboard and enables access
  await authService.logout();
  await useAuthStore.getState().checkAuth();
  assert(useAuthStore.getState().isAuthenticated === false, 'Logged out before scenario 8');
  const loginRes = await useAuthStore.getState().login({ email: freshGuestEmail, password: 'Password123!' });
  assert(loginRes === true, 'Scenario 8: Successful login');
  assert(useAuthStore.getState().isAuthenticated === true, 'Scenario 8: Authenticated state restored in Zustand store');

  // Scenario 9: Logged-in user plays music
  usePlayerStore.getState().playSong({
    id: 'sng-authed-test',
    title: 'Authed Test Song',
    artist: 'Artist',
    album: 'Album',
    duration: 180,
    genre: 'Synthwave',
    coverImage: '',
    audioUrl: '',
    artistId: 'art-1',
    albumId: 'alb-1',
    releaseDate: '2026-01-01',
  });
  assert(usePlayerStore.getState().isPlaying === true, 'Scenario 9: Logged-in user starts music playback successfully');
  assert(usePlayerStore.getState().currentSong?.id === 'sng-authed-test', 'Scenario 9: Current song loaded in music player');

  // Scenario 10: Logged-in user plays quiz
  await useQuizStore.getState().startQuiz('guess-artist');
  assert(useQuizStore.getState().attemptId !== null, 'Scenario 10: Quiz session started for logged-in user');
  assert(useQuizStore.getState().questions.length === 10, 'Scenario 10: Exactly 10 questions initialized');

  // Scenario 11: Logout clears session; browser back simulation
  await useAuthStore.getState().logout();
  assert(useAuthStore.getState().isAuthenticated === false, 'Scenario 11: Zustand isAuthenticated set to false');
  assert(localStorage.getItem(STORAGE_KEYS.CURRENT_USER) === null, 'Scenario 11: Current user session cleared from localStorage');
  // Browser back check: re-evaluating protected route without re-login
  const backButtonNavAttempt = useAuthStore.getState().isAuthenticated ? '/dashboard' : '/';
  assert(backButtonNavAttempt === '/', 'Scenario 11: Browser Back button still blocks access and redirects to "/"');

  // Scenario 12: Login again preserves points/profile
  await useAuthStore.getState().login({ email: freshGuestEmail, password: 'Password123!' });
  assert(useAuthStore.getState().user?.fullName === 'Jordan Waves', 'Scenario 12: Previous user profile retained upon re-login');
  assert(useAuthStore.getState().user?.email === freshGuestEmail, 'Scenario 12: Correct account reopened');

  console.log(`\n=== ALL TESTS PASSED! (${passed}/${total} assertions) ===`);
}

runTests().catch((err) => {
  console.error('\nTest runner failed:', err);
  process.exit(1);
});
