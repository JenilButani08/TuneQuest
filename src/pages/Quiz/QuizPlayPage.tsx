import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock,
  Volume2,
  Sparkles,
  ArrowRight,
  AlertTriangle,
  Play,
  Pause,
  CheckCircle,
  HelpCircle,
} from 'lucide-react';
import { useQuizStore } from '../../store/quizStore';
import { Button } from '../../components/ui/Button';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { proceduralAudio } from '../../utils/audioSynth';

export const QuizPlayPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const {
    questions,
    currentQuestionIndex,
    selectedOptionId,
    timeRemaining,
    maxTimeSeconds,
    isTimerActive,
    isAnswerSubmitted,
    isSubmittingQuiz,
    result,
    startQuiz,
    selectOption,
    confirmAnswer,
    nextQuestion,
    decrementTimer,
  } = useQuizStore();

  const [isPlayingAudioSnippet, setIsPlayingAudioSnippet] = useState(false);
  const navigate = useNavigate();

  // If page is loaded directly without an active quiz, initialize it
  useEffect(() => {
    if (questions.length === 0 && id) {
      startQuiz(id);
    }
  }, [id, questions.length, startQuiz]);

  // Interval timer for countdown
  useEffect(() => {
    if (!isTimerActive) return;

    const interval = setInterval(() => {
      decrementTimer();
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimerActive, decrementTimer]);

  // Once result is calculated, navigate to result page
  useEffect(() => {
    if (result) {
      navigate(`/quiz/result/${result.attemptId}`);
    }
  }, [result, navigate]);

  if (questions.length === 0 || !questions[currentQuestionIndex]) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-4">
        <div className="w-12 h-12 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />
        <p className="text-sm text-slate-400">Preparing music challenge arena...</p>
      </div>
    );
  }

  const currentQ = questions[currentQuestionIndex];
  const progressPercent = ((currentQuestionIndex + 1) / questions.length) * 100;
  const isTimeWarning = timeRemaining <= 8;

  const handleAudioSnippetToggle = () => {
    if (isPlayingAudioSnippet) {
      proceduralAudio.stop();
      setIsPlayingAudioSnippet(false);
    } else {
      setIsPlayingAudioSnippet(true);
      proceduralAudio.playTrack('snippet_challenge', 'synthwave');
      // Auto stop snippet after 10s
      setTimeout(() => {
        setIsPlayingAudioSnippet(false);
        proceduralAudio.stop();
      }, 10000);
    }
  };

  const handleConfirm = async () => {
    await confirmAnswer();
  };

  const handleNext = () => {
    if (isPlayingAudioSnippet) {
      proceduralAudio.stop();
      setIsPlayingAudioSnippet(false);
    }
    nextQuestion();
  };

  const optionLetters = ['A', 'B', 'C', 'D'];

  return (
    <div className="max-w-2xl mx-auto space-y-6 py-2 select-none">
      {/* Top Header: Question index, Progress & Timer */}
      <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-white/5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">
            Question {currentQuestionIndex + 1} of {questions.length}
          </span>

          {/* Countdown Timer with Warning State */}
          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold transition-all ${
              isTimeWarning
                ? 'bg-rose-950/80 border border-rose-500/80 text-rose-300 animate-pulse'
                : 'bg-slate-800/80 border border-slate-700 text-slate-200'
            }`}
          >
            <Clock className={`w-3.5 h-3.5 ${isTimeWarning ? 'text-rose-400' : 'text-purple-400'}`} />
            <span>{timeRemaining < 10 ? `0${timeRemaining}` : timeRemaining}s</span>
          </div>
        </div>

        <ProgressBar value={progressPercent} variant="primary" size="sm" />
      </div>

      {/* Main Question Card with Animated Transitions */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQ.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
          className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6 shadow-2xl relative"
        >
          {/* Question Text */}
          <h2 className="text-xl sm:text-2xl font-bold text-white leading-snug">
            {currentQ.question}
          </h2>

          {/* Visual Artwork or Audio Snippet Preview */}
          {currentQ.albumArtwork && (
            <div className="relative w-full max-w-xs mx-auto aspect-square rounded-2xl overflow-hidden border border-white/10 shadow-lg">
              <img
                src={currentQ.albumArtwork}
                alt="Question Artwork"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Interactive Audio Snippet player for Audio Challenges */}
          {currentQ.audioPreviewUrl && (
            <div className="p-4 rounded-2xl bg-[#0D0D16] border border-pink-500/30 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleAudioSnippetToggle}
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-white transition-all shadow-lg ${
                    isPlayingAudioSnippet ? 'bg-pink-600 scale-105' : 'bg-purple-600 hover:bg-purple-500'
                  }`}
                >
                  {isPlayingAudioSnippet ? (
                    <Pause className="w-5 h-5 fill-current" />
                  ) : (
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  )}
                </button>
                <div>
                  <p className="text-xs font-bold text-white">Audio Snippet</p>
                  <p className="text-[11px] text-slate-400">
                    {isPlayingAudioSnippet ? 'Playing sample (10s)...' : 'Tap to listen to the clue'}
                  </p>
                </div>
              </div>

              {isPlayingAudioSnippet && (
                <div className="flex items-end gap-1 h-5 pr-2">
                  <span className="w-1 h-3 bg-pink-400 rounded-full animate-bounce" />
                  <span className="w-1 h-5 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.2s]" />
                  <span className="w-1 h-4 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.4s]" />
                </div>
              )}
            </div>
          )}

          {/* Four Options: A, B, C, D */}
          <div className="grid grid-cols-1 gap-3 pt-2">
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedOptionId === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  disabled={isAnswerSubmitted}
                  onClick={() => selectOption(opt.id)}
                  className={`flex items-center gap-4 p-4 rounded-2xl border text-left transition-all duration-200 ${
                    isSelected
                      ? 'bg-purple-950/70 border-purple-500 text-purple-200 shadow-glow-primary/30 scale-[1.01]'
                      : 'bg-surface/80 border-slate-800 text-slate-300 hover:border-slate-600 hover:bg-white/5'
                  }`}
                >
                  <span
                    className={`w-8 h-8 rounded-xl font-mono text-xs font-bold flex items-center justify-center flex-shrink-0 transition-colors ${
                      isSelected
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {optionLetters[idx] || idx + 1}
                  </span>
                  <span className="text-sm font-medium flex-1">{opt.text}</span>
                </button>
              );
            })}
          </div>

          {/* Submit / Next Button Bar */}
          <div className="pt-4 border-t border-white/5 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              {isAnswerSubmitted ? 'Answer locked!' : 'Choose an answer and submit'}
            </span>

            {!isAnswerSubmitted ? (
              <Button
                variant="primary"
                size="md"
                disabled={!selectedOptionId}
                onClick={handleConfirm}
                glow
              >
                Submit Answer
              </Button>
            ) : (
              <Button
                variant="points"
                size="md"
                isLoading={isSubmittingQuiz}
                onClick={handleNext}
              >
                {currentQuestionIndex + 1 === questions.length ? 'View Results' : 'Next Question'}{' '}
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
