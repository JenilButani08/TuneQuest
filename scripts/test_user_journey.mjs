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

  console.log(`\n=== ALL TESTS PASSED! (${passed}/${total} assertions) ===`);
}

runTests().catch((err) => {
  console.error('\nTest runner failed:', err);
  process.exit(1);
});
