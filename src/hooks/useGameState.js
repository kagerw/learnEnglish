import { useState } from 'react';
import { vocabularyData } from '../data/vocabularyData';

export const useGameState = () => {
  // ゲーム状態
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [gameMode, setGameMode] = useState('normal'); // normal, speed
  const [questionDirection, setQuestionDirection] = useState('jp-to-en'); // jp-to-en, en-to-jp, example-to-en  
  const [questionType, setQuestionType] = useState('writing'); // writing, choice
  const [isCorrect, setIsCorrect] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [usedQuestions, setUsedQuestions] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [comboMultiplier, setComboMultiplier] = useState(1);
  const [speedBonus, setSpeedBonus] = useState(0);
  const [maxQuestions, setMaxQuestions] = useState(10);
  const [options, setOptions] = useState([]); // 4択の選択肢
  const [selectedChoice, setSelectedChoice] = useState(null); // 選択した選択肢
  const [wrongAnswers, setWrongAnswers] = useState([]); // 間違えた単語記録

  // 語彙データ管理
  const [currentVocabularyData, setCurrentVocabularyData] = useState(vocabularyData);

  // ゲーム開始
  const startGame = (speed = 'normal') => {
    setGameMode(speed);
    setGameStarted(true);
    setShowResult(false);
    setCurrentQuestion(null);
    setUserAnswer('');
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setQuestionCount(0);
    setCorrectCount(0);
    setIsCorrect(null);
    setShowHint(false);
    setUsedQuestions([]);
    setWrongAnswers([]);
    setComboMultiplier(1);
    setSpeedBonus(0);
    setOptions([]);
    setSelectedChoice(null);
  };

  // ゲームリセット
  const resetGame = () => {
    setGameStarted(false);
    setShowResult(false);
    setCurrentQuestion(null);
    setUserAnswer('');
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setQuestionCount(0);
    setCorrectCount(0);
    setIsCorrect(null);
    setShowHint(false);
    setUsedQuestions([]);
    setWrongAnswers([]);
    setComboMultiplier(1);
    setSpeedBonus(0);
    setOptions([]);
    setSelectedChoice(null);
  };

  return {
    // State
    currentQuestion, setCurrentQuestion,
    userAnswer, setUserAnswer,
    score, setScore,
    streak, setStreak,
    maxStreak, setMaxStreak,
    questionCount, setQuestionCount,
    correctCount, setCorrectCount,
    gameMode, setGameMode,
    questionDirection, setQuestionDirection,
    questionType, setQuestionType,
    isCorrect, setIsCorrect,
    showHint, setShowHint,
    usedQuestions, setUsedQuestions,
    gameStarted, setGameStarted,
    showResult, setShowResult,
    comboMultiplier, setComboMultiplier,
    speedBonus, setSpeedBonus,
    maxQuestions, setMaxQuestions,
    options, setOptions,
    selectedChoice, setSelectedChoice,
    wrongAnswers, setWrongAnswers,
    currentVocabularyData, setCurrentVocabularyData,
    
    // Actions
    startGame,
    resetGame
  };
};