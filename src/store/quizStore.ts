import { create } from 'zustand';
import { QuizQuestion, QuizCategory, QuizResult } from '../types';
import { quizService } from '../services/quiz/quizService';
import { proceduralAudio } from '../utils/audioSynth';
import { useWalletStore } from './walletStore';
import { useAuthStore } from './authStore';

interface QuizState {
  attemptId: string | null;
  category: QuizCategory | null;
  questions: QuizQuestion[];
  currentQuestionIndex: number;
  selectedOptionId: string | null;
  timeRemaining: number;
  maxTimeSeconds: number;
  isTimerActive: boolean;
  isAnswerSubmitted: boolean;
  isSubmittingQuiz: boolean;
  result: QuizResult | null;
  userAnswers: {
    questionId: string;
    selectedOptionId: string;
    timeTakenSeconds: number;
  }[];

  // Actions
  startQuiz: (categoryId: string, userPreferences?: string[]) => Promise<void>;
  selectOption: (optionId: string) => void;
  confirmAnswer: () => Promise<void>;
  nextQuestion: () => void;
  handleTimeUp: () => void;
  decrementTimer: () => void;
  resetQuiz: () => void;
}

export const useQuizStore = create<QuizState>((set, get) => ({
  attemptId: null,
  category: null,
  questions: [],
  currentQuestionIndex: 0,
  selectedOptionId: null,
  timeRemaining: 30,
  maxTimeSeconds: 30,
  isTimerActive: false,
  isAnswerSubmitted: false,
  isSubmittingQuiz: false,
  result: null,
  userAnswers: [],

  startQuiz: async (categoryId, userPreferences) => {
    set({
      attemptId: null,
      category: null,
      questions: [],
      currentQuestionIndex: 0,
      selectedOptionId: null,
      isTimerActive: false,
      isAnswerSubmitted: false,
      isSubmittingQuiz: false,
      result: null,
      userAnswers: [],
    });

    const session = await quizService.startQuiz(categoryId as any, userPreferences);

    set({
      attemptId: session.attemptId,
      category: session.category,
      questions: session.questions,
      timeRemaining: session.timeLimitSeconds,
      maxTimeSeconds: session.timeLimitSeconds,
      isTimerActive: true,
      currentQuestionIndex: 0,
      selectedOptionId: null,
      isAnswerSubmitted: false,
    });
  },

  selectOption: (optionId) => {
    if (get().isAnswerSubmitted) return;
    set({ selectedOptionId: optionId });
    // Play light UI audio feedback
    proceduralAudio.playTone(520, 0.08, 'sine');
  },

  confirmAnswer: async () => {
    const { attemptId, questions, currentQuestionIndex, selectedOptionId, timeRemaining, maxTimeSeconds, userAnswers } = get();
    if (!attemptId || !selectedOptionId || get().isAnswerSubmitted) return;

    const currentQ = questions[currentQuestionIndex];
    if (!currentQ) return;

    const timeTaken = Math.max(1, maxTimeSeconds - timeRemaining);
    const updatedAnswers = [
      ...userAnswers,
      {
        questionId: currentQ.id,
        selectedOptionId,
        timeTakenSeconds: timeTaken,
      },
    ];

    set({
      isAnswerSubmitted: true,
      isTimerActive: false,
      userAnswers: updatedAnswers,
    });

    // Notify mock server of answer
    await quizService.submitAnswer(attemptId, currentQ.id, selectedOptionId, timeTaken);
  },

  nextQuestion: async () => {
    const { questions, currentQuestionIndex, attemptId } = get();
    const nextIdx = currentQuestionIndex + 1;

    if (nextIdx < questions.length) {
      set({
        currentQuestionIndex: nextIdx,
        selectedOptionId: null,
        isAnswerSubmitted: false,
        timeRemaining: get().maxTimeSeconds,
        isTimerActive: true,
      });
    } else {
      // Quiz completed!
      if (!attemptId) return;
      set({ isSubmittingQuiz: true, isTimerActive: false });

      const finalResult = await quizService.completeQuiz(attemptId);
      
      // Sync stores with newly awarded TunePoints and stats
      try {
        useWalletStore.getState().fetchWalletData();
        useAuthStore.getState().checkAuth();
      } catch (e) {
        console.warn('Store sync error:', e);
      }

      set({
        result: finalResult,
        isSubmittingQuiz: false,
      });
    }
  },

  handleTimeUp: () => {
    const { isAnswerSubmitted } = get();
    if (isAnswerSubmitted) return;

    // Time expired: auto-submit with empty/current selection
    proceduralAudio.playTone(220, 0.3, 'sawtooth');
    get().confirmAnswer();
  },

  decrementTimer: () => {
    const { timeRemaining, isTimerActive } = get();
    if (!isTimerActive) return;

    if (timeRemaining <= 1) {
      set({ timeRemaining: 0 });
      get().handleTimeUp();
    } else {
      set({ timeRemaining: timeRemaining - 1 });
    }
  },

  resetQuiz: () => {
    set({
      attemptId: null,
      category: null,
      questions: [],
      currentQuestionIndex: 0,
      selectedOptionId: null,
      isTimerActive: false,
      isAnswerSubmitted: false,
      isSubmittingQuiz: false,
      result: null,
      userAnswers: [],
    });
  },
}));
