import { QuizCategory, QuizQuestion, QuizAttempt, QuizResult, QuizCategoryType } from '../../types';
import { mockQuizCategories, mockQuestions, mockDailyChallengeQuestions } from '../../mock/quizzes';
import { rewardService } from '../rewards/rewardService';
import { authService } from '../auth/authService';
import { POINTS } from '../../utils/storage';

// Active quiz attempts tracked locally
const activeAttempts = new Map<string, {
  attempt: QuizAttempt;
  correctAnswersMap: Map<string, string>;
  explanationsMap: Map<string, string>;
}>();

class QuizService {
  public async getCategories(): Promise<QuizCategory[]> {
    return mockQuizCategories.map((c) => ({
      ...c,
      questionCount: 10,
      rewardPoints: 100,
    }));
  }

  public async getCategory(id: QuizCategoryType): Promise<QuizCategory | null> {
    const found = mockQuizCategories.find((c) => c.id === id);
    if (!found) return null;
    return {
      ...found,
      questionCount: 10,
      rewardPoints: 100,
    };
  }

  /**
   * Initializes a 10-question quiz session with randomized questions
   */
  public async startQuiz(categoryId: QuizCategoryType | 'daily' | string, userPreferences?: string[]): Promise<{
    attemptId: string;
    category: QuizCategory;
    questions: QuizQuestion[];
    timeLimitSeconds: number;
  }> {
    await new Promise((r) => setTimeout(r, 150));
    const currentUser = await authService.getCurrentUser();
    const attemptId = `att_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    let candidatePool: QuizQuestion[] = [];

    if (categoryId === 'user-preferences') {
      const preferences =
        userPreferences && userPreferences.length > 0
          ? userPreferences
          : currentUser?.favoriteGenres || ['Bollywood', 'Indie', 'Punjabi', 'Pop', 'Synthwave'];

      // Find questions matching any user preference keyword
      const prefMatches = mockQuestions.filter((q) => {
        const content = `${q.question} ${q.explanation || ''} ${q.options.map((o) => o.text).join(' ')}`.toLowerCase();
        return preferences.some((pref) => content.includes(pref.toLowerCase().trim()));
      });

      const otherQuestions = mockQuestions.filter((q) => !prefMatches.some((pm) => pm.id === q.id));
      candidatePool = [...prefMatches, ...otherQuestions];
    } else if (categoryId === 'daily') {
      candidatePool = [...mockDailyChallengeQuestions, ...mockQuestions];
    } else {
      const catFiltered = mockQuestions.filter((q) => q.categoryId === categoryId);
      const otherQuestions = mockQuestions.filter((q) => q.categoryId !== categoryId);
      candidatePool = [...catFiltered, ...otherQuestions];
    }

    // Dynamic shuffle every single time
    const shuffled = [...candidatePool].sort(() => Math.random() - 0.5);

    // EXACTLY 10 questions per quiz session
    const rawQuestions = shuffled.slice(0, 10);

    const category: QuizCategory =
      categoryId === 'daily'
        ? {
            id: 'trending-music' as QuizCategoryType,
            name: "Today's Daily Challenge",
            description: '10 curated questions. Test your ears, keep your streak alive, and earn up to 100 TunePoints!',
            iconName: 'Sparkles',
            accentColor: '#8B5CF6',
            questionCount: 10,
            rewardPoints: 100,
            rewardXp: 50,
            timeLimitSeconds: 30,
            difficulty: 'Medium' as const,
            badge: 'Daily Streak',
          }
        : categoryId === 'user-preferences'
        ? {
            id: 'user-preferences' as QuizCategoryType,
            name: 'My Preferences Gauntlet',
            description: '10 fresh questions tailored to your favorite genres and artists. Dynamic & shuffled every round!',
            iconName: 'Sparkles',
            accentColor: '#F59E0B',
            questionCount: 10,
            rewardPoints: 100,
            rewardXp: 50,
            timeLimitSeconds: 30,
            difficulty: 'Medium' as const,
            badge: 'Personalized For You',
          }
        : {
            ...(mockQuizCategories.find((c) => c.id === categoryId) || mockQuizCategories[0]),
            questionCount: 10,
            rewardPoints: 100,
          };

    // Sanitize questions for frontend: strip correctOptionId to prevent cheat inspection
    const sanitizedQuestions: QuizQuestion[] = rawQuestions.map((q) => ({
      id: q.id,
      categoryId: q.categoryId,
      question: q.question,
      snippet: q.snippet,
      albumArtwork: q.albumArtwork,
      audioPreviewUrl: q.audioPreviewUrl,
      options: q.options,
    }));

    // Store authoritative answer keys locally for this attempt
    const correctAnswersMap = new Map<string, string>();
    const explanationsMap = new Map<string, string>();
    rawQuestions.forEach((q) => {
      if (q.correctOptionId) {
        correctAnswersMap.set(q.id, q.correctOptionId);
      } else if (q.options[0]?.id) {
        correctAnswersMap.set(q.id, q.options[0].id);
      }
      if (q.explanation) {
        explanationsMap.set(q.id, q.explanation);
      }
    });

    const attempt: QuizAttempt = {
      attemptId,
      quizId: categoryId,
      categoryId: category.id,
      userId: currentUser?.id || 'usr_music_explorer_01',
      startedAt: new Date().toISOString(),
      timeLimitSeconds: category.timeLimitSeconds,
      totalQuestions: sanitizedQuestions.length,
      currentQuestionIndex: 0,
      questions: sanitizedQuestions,
      answers: [],
    };

    activeAttempts.set(attemptId, {
      attempt,
      correctAnswersMap,
      explanationsMap,
    });

    return {
      attemptId,
      category,
      questions: sanitizedQuestions,
      timeLimitSeconds: category.timeLimitSeconds,
    };
  }

  /**
   * Submits an answer for the current question
   */
  public async submitAnswer(
    attemptId: string,
    questionId: string,
    selectedOptionId: string,
    timeTakenSeconds: number
  ): Promise<{ isAccepted: boolean; isCorrect: boolean }> {
    const session = activeAttempts.get(attemptId);
    let isCorrect = false;

    if (session) {
      session.attempt.answers.push({
        questionId,
        selectedOptionId,
        answeredAt: new Date().toISOString(),
        timeTakenSeconds,
      });

      const correctOptId = session.correctAnswersMap.get(questionId);
      isCorrect = selectedOptionId === correctOptId;
    }

    return { isAccepted: true, isCorrect };
  }

  /**
   * Validates attempt, calculates points, commits wallet transaction, and returns results
   */
  public async completeQuiz(attemptId: string): Promise<QuizResult> {
    await new Promise((r) => setTimeout(r, 350));
    const session = activeAttempts.get(attemptId);
    const currentUser = await authService.getCurrentUser();

    let score = 0;
    const totalQuestions = 10;
    const breakdown: QuizResult['breakdown'] = [];

    if (session) {
      const { attempt, correctAnswersMap, explanationsMap } = session;

      attempt.questions.forEach((q) => {
        const userAnswerRecord = attempt.answers.find((a) => a.questionId === q.id);
        const selectedOptionId = userAnswerRecord ? userAnswerRecord.selectedOptionId : '';
        const correctOptionId = correctAnswersMap.get(q.id) || q.options[0]?.id || '';

        const isCorrect = selectedOptionId === correctOptionId;
        if (isCorrect) score++;

        const userOpt = q.options.find((o) => o.id === selectedOptionId);
        const correctOpt = q.options.find((o) => o.id === correctOptionId);

        breakdown.push({
          questionId: q.id,
          question: q.question,
          userAnswer: userOpt ? userOpt.text : 'Time expired / No answer',
          correctAnswer: correctOpt ? correctOpt.text : 'Option A',
          isCorrect,
          explanation: explanationsMap.get(q.id) || 'Trivia verified from TuneQuest Music Library.',
        });
      });
    }

    const pointsEarned = score * POINTS.QUIZ_CORRECT;
    const xpEarned = score * 5 + (totalQuestions - score);

    // Commit transaction & points to user in localStorage
    if (pointsEarned > 0 && currentUser) {
      await rewardService.recordPointReward(
        pointsEarned,
        `Quiz Challenge Completed (${score}/10 correct)`,
        'QUIZ_REWARD',
        currentUser.id
      );
    }

    // Update user quiz stats and streak in localStorage
    if (currentUser) {
      const updatedStats = {
        ...currentUser.stats,
        quizzesCompleted: (currentUser.stats?.quizzesCompleted || 0) + 1,
        correctAnswers: (currentUser.stats?.correctAnswers || 0) + score,
        accuracyPercent: Math.round(
          (((currentUser.stats?.correctAnswers || 0) + score) /
            (((currentUser.stats?.quizzesCompleted || 0) + 1) * 10)) *
            100
        ),
      };

      await authService.updateProfile(currentUser.id, {
        stats: updatedStats as any,
        xp: (currentUser.xp || 0) + xpEarned,
      });
    }

    const updatedWallet = await rewardService.getWallet();

    const result: QuizResult = {
      attemptId,
      quizTitle:
        session?.attempt.categoryId === 'trending-music'
          ? 'Daily Music Challenge'
          : 'Music Trivia Challenge',
      score,
      totalQuestions,
      accuracy: Math.round((score / totalQuestions) * 100),
      tunePointsEarned: pointsEarned,
      xpEarned,
      streakDays: (currentUser?.streak || 7) + 1,
      newTunePointsBalance: updatedWallet.balance,
      correctAnswersCount: score,
      incorrectAnswersCount: totalQuestions - score,
      breakdown,
    };

    return result;
  }
}

export const quizService = new QuizService();
