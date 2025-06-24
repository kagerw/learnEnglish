import React from 'react';
import { RotateCcw, Zap } from 'lucide-react';

const GameHeader = ({ 
  questionDirection, 
  gameMode, 
  questionType, 
  questionCount, 
  maxQuestions, 
  currentVocabularyData, 
  score, 
  streak, 
  comboMultiplier, 
  correctCount, 
  timeLeft, 
  onResetGame 
}) => {
  const getQuestionDirectionLabel = () => {
    switch (questionDirection) {
      case 'jp-to-en': return '日→英';
      case 'en-to-jp': return '英→日';
      case 'example-to-en': return '例文→英';
      default: return '';
    }
  };

  const getQuestionTypeLabel = () => {
    if (questionType === 'writing') {
      switch (questionDirection) {
        case 'jp-to-en': return '英作文';
        case 'en-to-jp': return '日本語';
        case 'example-to-en': return '穴埋め';
        default: return '記述';
      }
    }
    return '4択';
  };

  const getGameTitle = () => {
    switch (questionDirection) {
      case 'jp-to-en': return '英作文チャレンジ';
      case 'en-to-jp': return '英語学習クイズ';
      case 'example-to-en': return '例文穴埋めクイズ';
      default: return '英語学習ゲーム';
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-4 mb-6 border border-white/20">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-white">
            {getGameTitle()}
          </h1>
          <div className="flex items-center gap-2 text-sm">
            <div className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs">
              {gameMode === 'speed' ? 'SPEED' : 'NORMAL'}
            </div>
            <div className="bg-purple-500 text-white px-2 py-1 rounded-full text-xs">
              {getQuestionDirectionLabel()}
            </div>
            <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs">
              {getQuestionTypeLabel()}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-white font-bold text-lg">
            第{Math.min(questionCount + 1, maxQuestions === 0 ? currentVocabularyData.length : maxQuestions)}問 / 全{maxQuestions === 0 ? currentVocabularyData.length : maxQuestions}問
          </div>
          <button
            onClick={onResetGame}
            className="text-white/70 hover:text-white transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-4 gap-4 mb-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-yellow-400">{score.toLocaleString()}</div>
          <div className="text-xs text-white/70">スコア</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-400 flex items-center justify-center gap-1">
            {streak}
            {streak >= 5 && <Zap className="w-4 h-4" />}
          </div>
          <div className="text-xs text-white/70">連続正解</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-400">
            {comboMultiplier > 1 ? `×${comboMultiplier}` : '×1'}
          </div>
          <div className="text-xs text-white/70">コンボ</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-400">{correctCount}/{questionCount}</div>
          <div className="text-xs text-white/70">正解率</div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-4 mb-4">
        <div className="text-center">
          <div className={`text-2xl font-bold ${timeLeft <= 5 ? 'text-red-400 animate-pulse' : 'text-blue-400'}`}>
            {timeLeft}
          </div>
          <div className="text-xs text-white/70">残り時間</div>
        </div>
      </div>

      {/* 進度バー */}
      <div className="mt-4">
        <div className="flex justify-between text-xs text-white/70 mb-1">
          <span>進度</span>
          <span>{Math.min(questionCount, maxQuestions === 0 ? currentVocabularyData.length : maxQuestions)}/{maxQuestions === 0 ? currentVocabularyData.length : maxQuestions}</span>
        </div>
        <div className="w-full bg-white/20 rounded-full h-2">
          <div 
            className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(100, (questionCount / (maxQuestions === 0 ? currentVocabularyData.length : maxQuestions)) * 100)}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default GameHeader;