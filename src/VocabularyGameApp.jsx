import React, { useEffect } from 'react';
import { useGameState } from './hooks/useGameState';
import { useTimer } from './hooks/useTimer';
import { useVocabularyData } from './hooks/useVocabularyData';
import { calculateScore, generateChoices, checkAnswerCorrectness, createExampleWithBlank } from './utils/gameUtils';
import StartScreen from './components/StartScreen';
import GameHeader from './components/GameHeader';
import QuestionCard from './components/QuestionCard';
import ResultScreen from './components/ResultScreen';

const VocabularyGameApp = () => {
  const gameState = useGameState();
  const vocabularyData = useVocabularyData();
  
  const {
    currentQuestion, setCurrentQuestion,
    userAnswer, setUserAnswer,
    score, setScore,
    streak, setStreak,
    maxStreak, setMaxStreak,
    questionCount, setQuestionCount,
    correctCount, setCorrectCount,
    gameMode,
    questionDirection,
    questionType,
    isCorrect, setIsCorrect,
    showHint, setShowHint,
    usedQuestions, setUsedQuestions,
    gameStarted,
    showResult, setShowResult,
    comboMultiplier, setComboMultiplier,
    speedBonus, setSpeedBonus,
    maxQuestions,
    options, setOptions,
    selectedChoice, setSelectedChoice,
    wrongAnswers, setWrongAnswers,
    startGame,
    resetGame,
    // Getters from gameState
    setQuestionDirection,
    setQuestionType,
    setMaxQuestions
  } = gameState;

  // タイマー処理
  const handleTimeOut = () => {
    setIsCorrect(false);
    setStreak(0);
    setComboMultiplier(1);
    
    const newQuestionCount = questionCount + 1;
    setQuestionCount(newQuestionCount);
    
    if (currentQuestion) {
      const wrongAnswer = {
        word: currentQuestion,
        userAnswer: 'タイムアウト',
        correctAnswer: questionDirection === 'jp-to-en' || questionDirection === 'example-to-en' 
          ? currentQuestion.english 
          : currentQuestion.japanese,
        questionType: questionType,
        questionDirection: questionDirection
      };
      setWrongAnswers(prev => [...prev, wrongAnswer]);
    }
    
    const maxQuestionsLimit = maxQuestions === 0 ? vocabularyData.currentVocabularyData.length : maxQuestions;
    if (newQuestionCount >= maxQuestionsLimit) {
      setTimeout(() => {
        setShowResult(true);
      }, 1500);
    }
  };

  const timer = useTimer(gameStarted, showResult, currentQuestion, gameMode, handleTimeOut);

  // 新しい問題を生成
  const generateQuestion = (forceStart = false) => {
    if (!forceStart) {
      const maxQuestionsLimit = maxQuestions === 0 ? vocabularyData.currentVocabularyData.length : maxQuestions;
      if (questionCount >= maxQuestionsLimit) {
        setShowResult(true);
        return;
      }
    }

    // 例文→単語モードの場合は、例文がある単語のみフィルタリング
    let availableQuestions = vocabularyData.currentVocabularyData.filter(word => !usedQuestions.includes(word.english));
    
    if (questionDirection === 'example-to-en') {
      availableQuestions = availableQuestions.filter(word => word.example && word.example.trim() !== '');
      
      if (availableQuestions.length === 0) {
        alert('例文モード用のデータが不足しています。CSVファイルの3列目に例文を追加してください。');
        return;
      }
    }
    
    if (availableQuestions.length === 0) {
      setShowResult(true);
      return;
    }

    const randomWord = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
    setCurrentQuestion(randomWord);
    setUsedQuestions(prev => [...prev, randomWord.english]);
    setUserAnswer('');
    setIsCorrect(null);
    setShowHint(false);
    setSelectedChoice(null);
    timer.resetTimer();
    setSpeedBonus(0);
    
    // 4択問題の場合は選択肢を生成
    if (questionType === 'choice') {
      setOptions(generateChoices(randomWord, vocabularyData.currentVocabularyData));
    } else {
      setOptions([]);
    }
  };

  // 回答結果を処理
  const processAnswer = (isAnswerCorrect, providedAnswer = null) => {
    setIsCorrect(isAnswerCorrect);

    if (isAnswerCorrect) {
      const { totalPoints, speedBonus: calculatedSpeedBonus } = calculateScore(
        10, // baseScore
        currentQuestion,
        gameMode,
        timer.timeLeft,
        showHint,
        questionType,
        comboMultiplier
      );

      setSpeedBonus(calculatedSpeedBonus);
      setScore(prev => prev + totalPoints);
      setStreak(prev => prev + 1);
      setMaxStreak(prev => Math.max(prev, streak + 1));
      setCorrectCount(prev => prev + 1);
      
      if (streak >= 4) setComboMultiplier(prev => Math.min(prev + 0.5, 3));
    } else {
      setStreak(0);
      setComboMultiplier(1);
      
      const userResponseText = providedAnswer || 
        (questionType === 'writing' ? userAnswer : '未回答');
      
      const wrongAnswer = {
        word: currentQuestion,
        userAnswer: userResponseText,
        correctAnswer: questionDirection === 'jp-to-en' || questionDirection === 'example-to-en' 
          ? currentQuestion.english 
          : currentQuestion.japanese,
        questionType: questionType,
        questionDirection: questionDirection
      };
      setWrongAnswers(prev => [...prev, wrongAnswer]);
    }

    const newQuestionCount = questionCount + 1;
    setQuestionCount(newQuestionCount);
    
    const maxQuestionsLimit = maxQuestions === 0 ? vocabularyData.currentVocabularyData.length : maxQuestions;
    if (newQuestionCount >= maxQuestionsLimit) {
      setTimeout(() => {
        setShowResult(true);
      }, 1500);
    }
  };

  // 答えをチェック（英作文用）
  const checkAnswer = () => {
    if (!currentQuestion || userAnswer.trim() === '') return;

    const userInput = userAnswer.trim().toLowerCase();
    let correctAnswer;
    
    if (questionDirection === 'jp-to-en') {
      correctAnswer = currentQuestion.english.toLowerCase();
    } else if (questionDirection === 'en-to-jp') {
      correctAnswer = currentQuestion.japanese;
    } else if (questionDirection === 'example-to-en') {
      correctAnswer = currentQuestion.english.toLowerCase();
    }
    
    const isAnswerCorrect = checkAnswerCorrectness(userInput, correctAnswer, questionDirection);
    processAnswer(isAnswerCorrect, userInput);
  };

  // 4択回答を選択
  const selectChoice = (selectedWord) => {
    if (selectedChoice !== null) return;

    setSelectedChoice(selectedWord);
    
    let isAnswerCorrect;
    if (questionDirection === 'jp-to-en' || questionDirection === 'example-to-en') {
      isAnswerCorrect = selectedWord.english === currentQuestion.english;
    } else if (questionDirection === 'en-to-jp') {
      isAnswerCorrect = selectedWord.japanese === currentQuestion.japanese;
    }
    
    const selectedAnswer = questionDirection === 'jp-to-en' || questionDirection === 'example-to-en' 
      ? selectedWord.english 
      : selectedWord.japanese;
    
    processAnswer(isAnswerCorrect, selectedAnswer);
  };

  // 次の問題へ進む
  const goToNextQuestion = () => {
    const maxQuestionsLimit = maxQuestions === 0 ? vocabularyData.currentVocabularyData.length : maxQuestions;
    if (questionCount >= maxQuestionsLimit) {
      setShowResult(true);
      return;
    }
    
    generateQuestion();
  };

  // グローバルキーボードイベント管理
  useEffect(() => {
    const handleGlobalKeyPress = (e) => {
      if (!gameStarted || showResult) return;
      
      // 入力フィールドからのEnterは完全スルー
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      
      if (e.key === 'Enter') {
        if (isCorrect === null && questionType === 'writing' && userAnswer.trim() !== '') {
          checkAnswer();
        } else if (isCorrect !== null) {
          goToNextQuestion();
        }
      }
    };

    document.addEventListener('keydown', handleGlobalKeyPress);
    return () => document.removeEventListener('keydown', handleGlobalKeyPress);
  }, [gameStarted, showResult, isCorrect, questionType, userAnswer]);

  // ゲーム開始フラグを監視して問題生成
  useEffect(() => {
    if (gameStarted && !showResult && usedQuestions.length === 0 && !currentQuestion) {
      generateQuestion(true);
    }
  }, [gameStarted, showResult, usedQuestions, currentQuestion]);

  // 語彙データの同期
  useEffect(() => {
    gameState.setCurrentVocabularyData(vocabularyData.currentVocabularyData);
  }, [vocabularyData.currentVocabularyData]);

  // スタート画面
  if (!gameStarted) {
    return (
      <StartScreen
        questionDirection={questionDirection}
        setQuestionDirection={setQuestionDirection}
        questionType={questionType}
        setQuestionType={setQuestionType}
        maxQuestions={maxQuestions}
        setMaxQuestions={setMaxQuestions}
        currentVocabularyData={vocabularyData.currentVocabularyData}
        onStartGame={startGame}
        uploadedFileName={vocabularyData.uploadedFileName}
        isUploading={vocabularyData.isUploading}
        uploadError={vocabularyData.uploadError}
        encoding={vocabularyData.encoding}
        setEncoding={vocabularyData.setEncoding}
        onFileUpload={vocabularyData.handleFileUpload}
        onResetToDefault={vocabularyData.resetToDefaultData}
      />
    );
  }

  // 結果画面
  if (showResult) {
    return (
      <ResultScreen
        score={score}
        questionCount={questionCount}
        correctCount={correctCount}
        maxStreak={maxStreak}
        wrongAnswers={wrongAnswers}
        gameMode={gameMode}
        onResetGame={resetGame}
        onStartGame={startGame}
      />
    );
  }

  // ゲーム画面
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-4xl mx-auto">
        <GameHeader
          questionDirection={questionDirection}
          gameMode={gameMode}
          questionType={questionType}
          questionCount={questionCount}
          maxQuestions={maxQuestions}
          currentVocabularyData={vocabularyData.currentVocabularyData}
          score={score}
          streak={streak}
          comboMultiplier={comboMultiplier}
          correctCount={correctCount}
          timeLeft={timer.timeLeft}
          onResetGame={resetGame}
        />

        <QuestionCard
          currentQuestion={currentQuestion}
          questionDirection={questionDirection}
          questionType={questionType}
          userAnswer={userAnswer}
          setUserAnswer={setUserAnswer}
          options={options}
          selectedChoice={selectedChoice}
          onSelectChoice={selectChoice}
          onCheckAnswer={checkAnswer}
          showHint={showHint}
          setShowHint={setShowHint}
          isCorrect={isCorrect}
          timeLeft={timer.timeLeft}
          speedBonus={speedBonus}
          comboMultiplier={comboMultiplier}
          streak={streak}
          onGoToNextQuestion={goToNextQuestion}
        />
      </div>
    </div>
  );
};

export default VocabularyGameApp;