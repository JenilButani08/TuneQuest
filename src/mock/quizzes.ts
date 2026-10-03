import { QuizCategory, QuizQuestion } from '../types';
import quizzesJson from '../data/quizzes.json';

export const mockQuizCategories: QuizCategory[] = quizzesJson.categories as QuizCategory[];
export const mockQuestions: QuizQuestion[] = quizzesJson.questions as QuizQuestion[];
export const mockDailyChallengeQuestions: QuizQuestion[] = quizzesJson.dailyChallenges as QuizQuestion[];
