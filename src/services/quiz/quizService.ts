import { QuizCategory, QuizQuestion, QuizAttempt, QuizResult, QuizCategoryType } from '../../types';
import { mockQuizCategories, mockQuestions, mockDailyChallengeQuestions } from '../../mock/quizzes';
import { mockCurrentUser } from '../../mock/users';
import { rewardService } from '../rewards/rewardService';
import { apiClient } from '../api/apiClient';

const IS_DEMO_MODE = import.meta.env.VITE_DEMO_MODE !== 'false';

// Active quiz attempts tracked on mock "backend"
const activeServerAttempts = new Map<string, {
  attempt: QuizAttempt;
  correctAnswersMap: Map<string, string>;
  explanationsMap: Map<string, string>;
}>();

class QuizService {
  public async getCategories(): Promise<QuizCategory[]> {
    if (IS_DEMO_MODE) {
      await new Promise((r) => setTimeout(r, 100));
      return [...mockQuizCategories];
    }
    return await apiClient.get<QuizCategory[]>('/quizzes/categories');
  }

  public async getCategory(id: QuizCategoryType): Promise<QuizCategory | null> {
    if (IS_DEMO_MODE) {
      return mockQuizCategories.find((c) => c.id === id) || null;
    }
    return await apiClient.get<QuizCategory>(`/quizzes/categories/${id}`);
  }

  /**
   * Initializes a quiz session and returns sanitized questions
   * Security architecture: Correct answers remain on backend and are never sent to client upfront!
  /**
   * Initializes a quiz session and returns sanitized questions
   * Security architecture: Correct answers remain on backend and are never sent to client upfront!
   * Requirement: Strictly 5 questions per session, dynamically randomized every single time, with user preferences support.
   */
  public async startQuiz(categoryId: QuizCategoryType | 'daily' | string, userPreferences?: string[]): Promise<{
    attemptId: string;
    category: QuizCategory;
    questions: QuizQuestion[];
    timeLimitSeconds: number;
  }> {
    if (IS_DEMO_MODE) {
      await new Promise((r) => setTimeout(r, 200));
      const attemptId = `att_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      
      let candidatePool: QuizQuestion[] = [];

      if (categoryId === 'user-preferences') {
        const preferences = (userPreferences && userPreferences.length > 0)
          ? userPreferences
          : (mockCurrentUser.favoriteGenres || ['Bollywood', 'Indie', 'Punjabi', 'Pop', 'Synthwave']);
        
        // Find questions matching any user preference keyword in question, options, or explanation
        const prefMatches = mockQuestions.filter((q) => {
          const content = `${q.question} ${q.explanation || ''} ${q.options.map(o => o.text).join(' ')}`.toLowerCase();
          return preferences.some((pref) => content.includes(pref.toLowerCase().trim()));
        });

        // Mix preference matches with general questions if pool is smaller than 10
        const otherQuestions = mockQuestions.filter((q) => !prefMatches.some((pm) => pm.id === q.id));
        candidatePool = [...prefMatches, ...otherQuestions];
      } else if (categoryId === 'daily') {
        candidatePool = [...mockDailyChallengeQuestions, ...mockQuestions];
      } else {
        const catFiltered = mockQuestions.filter((q) => q.categoryId === categoryId);
        candidatePool = catFiltered.length > 0 ? catFiltered : mockQuestions;
      }

      // DYNAMIC SHUFFLE: Randomize every single time user starts a quiz
      const shuffled = [...candidatePool].sort(() => Math.random() - 0.5);

      // STRICT LIMIT: Exactly 5 questions per quiz session
      const rawQuestions = shuffled.slice(0, 5);

      const category: QuizCategory = categoryId === 'daily'
        ? {
            id: 'trending-music' as QuizCategoryType,
            name: "Today's Daily Challenge",
            description: "5 curated questions. Maintain your streak and unlock +50 TunePoints!",
            iconName: 'Sparkles',
            accentColor: '#8B5CF6',
            questionCount: 5,
            rewardPoints: 50,
            rewardXp: 25,
            timeLimitSeconds: 30,
            difficulty: 'Medium' as const,
            badge: 'Daily Streak',
          }
        : categoryId === 'user-preferences'
        ? {
            id: 'user-preferences' as QuizCategoryType,
            name: 'My Preferences Gauntlet',
            description: '5 fresh questions tailored to your favorite genres and artists. Dynamic & shuffled every round!',
            iconName: 'Sparkles',
            accentColor: '#F59E0B',
            questionCount: 5,
            rewardPoints: 50,
            rewardXp: 30,
            timeLimitSeconds: 30,
            difficulty: 'Medium' as const,
            badge: '★ Personalized For You',
          }
        : {
            ...(mockQuizCategories.find((c) => c.id === categoryId) || mockQuizCategories[0]),
            questionCount: 5,
            rewardPoints: 50,
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

      // Store authoritative answer keys on the mock server
      const correctAnswersMap = new Map<string, string>();
      const explanationsMap = new Map<string, string>();
      rawQuestions.forEach((q) => {
        if (q.correctOptionId) {
          correctAnswersMap.set(q.id, q.correctOptionId);
        }
        if (q.explanation) {
          explanationsMap.set(q.id, q.explanation);
        }
      });

      const attempt: QuizAttempt = {
        attemptId,
        quizId: categoryId,
        categoryId: category.id,
        userId: mockCurrentUser.id,
        startedAt: new Date().toISOString(),
        timeLimitSeconds: category.timeLimitSeconds,
        totalQuestions: sanitizedQuestions.length,
        currentQuestionIndex: 0,
        questions: sanitizedQuestions,
        answers: [],
      };

      activeServerAttempts.set(attemptId, {
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

    return await apiClient.post('/quizzes/start', { categoryId });
  }

  /**
   * Submits an answer for validation
   */
  public async submitAnswer(
    attemptId: string,
    questionId: string,
    selectedOptionId: string,
    timeTakenSeconds: number
  ): Promise<{ isAccepted: boolean }> {
    if (IS_DEMO_MODE) {
      const serverSession = activeServerAttempts.get(attemptId);
      if (serverSession) {
        serverSession.attempt.answers.push({
          questionId,
          selectedOptionId,
          answeredAt: new Date().toISOString(),
          timeTakenSeconds,
        });
      }
      return { isAccepted: true };
    }

    return await apiClient.post(`/quizzes/${attemptId}/answer`, {
      questionId,
      selectedOptionId,
      timeTakenSeconds,
    });
  }

  /**
   * Server validates attempt, calculates points, commits wallet transaction, and returns results
   */
  public async completeQuiz(attemptId: string): Promise<QuizResult> {
    if (IS_DEMO_MODE) {
      await new Promise((r) => setTimeout(r, 400));
      const serverSession = activeServerAttempts.get(attemptId);

      let score = 0;
      let totalQuestions = 5;
      const breakdown: QuizResult['breakdown'] = [];

      if (serverSession) {
        const { attempt, correctAnswersMap, explanationsMap } = serverSession;
        totalQuestions = attempt.questions.length;

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
            explanation: explanationsMap.get(q.id) || 'Music challenge trivia knowledge base verified.',
          });
        });
      }

      const pointsEarned = score * 10;
      const xpEarned = (score * 5) + (totalQuestions - score); // +5 per correct, +1 for participation

      // Commit transaction to wallet service atomically
      if (pointsEarned > 0) {
        await rewardService.recordPointReward(
          pointsEarned,
          `Quiz Challenge Completed (${score}/${totalQuestions} correct)`
        );
      }

      const updatedWallet = await rewardService.getWallet();

      const result: QuizResult = {
        attemptId,
        quizTitle: serverSession?.attempt.categoryId === 'trending-music' ? "Daily Music Challenge" : "Music Trivia Challenge",
        score,
        totalQuestions,
        accuracy: Math.round((score / totalQuestions) * 100),
        tunePointsEarned: pointsEarned,
        xpEarned,
        streakDays: mockCurrentUser.streak + 1,
        newTunePointsBalance: updatedWallet.balance,
        correctAnswersCount: score,
        incorrectAnswersCount: totalQuestions - score,
        breakdown,
      };

      return result;
    }

    return await apiClient.post<QuizResult>(`/quizzes/${attemptId}/complete`);
  }
}

export const quizService = new QuizService();
