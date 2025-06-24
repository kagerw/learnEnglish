import { useState, useEffect, useRef } from 'react';

export const useTimer = (gameStarted, showResult, currentQuestion, gameMode, onTimeOut) => {
  const [timeLeft, setTimeLeft] = useState(30);
  const timerRef = useRef(null);

  // タイマー管理
  useEffect(() => {
    if (gameStarted && !showResult && currentQuestion && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && currentQuestion) {
      // タイムオーバー
      onTimeOut();
    }
    return () => clearTimeout(timerRef.current);
  }, [timeLeft, gameStarted, showResult, currentQuestion, onTimeOut]);

  // タイマーリセット
  const resetTimer = () => {
    setTimeLeft(gameMode === 'speed' ? 15 : 30);
  };

  return {
    timeLeft,
    setTimeLeft,
    resetTimer
  };
};