import React from 'react';
import { Trophy, BookOpen, Award, Target, RotateCcw } from 'lucide-react';
import { createExampleWithBlank, getDifficultyColor } from '../utils/gameUtils';

const ResultScreen = ({ 
  score, 
  questionCount, 
  correctCount, 
  maxStreak, 
  wrongAnswers, 
  gameMode, 
  onResetGame, 
  onStartGame 
}) => {
  const accuracy = questionCount > 0 ? Math.round((correctCount / questionCount) * 100) : 0;
  const avgScore = questionCount > 0 ? Math.round(score / questionCount) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-orange-500 to-red-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-lg w-full text-center">
        <div className="mb-6">
          <Trophy className="w-20 h-20 mx-auto text-yellow-500 mb-4" />
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            {wrongAnswers.length === 0 ? '🎉 パーフェクト！' : 'ゲーム終了！'}
          </h2>
          <div className="text-lg text-gray-600">お疲れさまでした！</div>
        </div>
        
        <div className="space-y-4 mb-8">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl p-6">
            <div className="text-4xl font-bold">{score.toLocaleString()}</div>
            <div className="text-sm opacity-90">総スコア</div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-600">{accuracy}%</div>
              <div className="text-xs text-green-500">正答率</div>
            </div>
            <div className="bg-orange-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-orange-600">{maxStreak}</div>
              <div className="text-xs text-orange-500">最大連続正解</div>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div className="bg-blue-50 rounded p-2">
              <div className="font-bold text-blue-600">{correctCount}</div>
              <div className="text-xs text-blue-500">正解数</div>
            </div>
            <div className="bg-purple-50 rounded p-2">
              <div className="font-bold text-purple-600">{questionCount}</div>
              <div className="text-xs text-purple-500">総問題数</div>
            </div>
            <div className="bg-pink-50 rounded p-2">
              <div className="font-bold text-pink-600">{avgScore}</div>
              <div className="text-xs text-pink-500">平均得点</div>
            </div>
          </div>
          
          {wrongAnswers.length === 0 && correctCount === questionCount && (
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg p-3">
              <div className="flex items-center justify-center gap-2">
                <Award className="w-5 h-5" />
                <span className="font-bold">パーフェクトボーナス +500pt!</span>
              </div>
            </div>
          )}
        </div>

        {/* 間違えた単語一覧 */}
        {wrongAnswers.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              復習用：間違えた単語 ({wrongAnswers.length}個)
            </h3>
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 max-h-60 overflow-y-auto">
              <div className="space-y-3">
                {wrongAnswers.map((wrong, index) => (
                  <div key={index} className="bg-white rounded-lg p-3 border border-red-100">
                    <div className="flex justify-between items-start mb-2">
                      <div className="text-lg font-bold text-gray-800">
                        {wrong.questionDirection === 'jp-to-en' ? wrong.word.japanese : 
                         wrong.questionDirection === 'en-to-jp' ? wrong.word.english :
                         createExampleWithBlank(wrong.word.example, wrong.word.english)}
                      </div>
                      <div className={`px-2 py-1 rounded text-xs ${getDifficultyColor(wrong.word.difficulty)}`}>
                        {wrong.word.difficulty}
                      </div>
                    </div>
                    <div className="text-sm space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-green-600 font-medium">正解:</span>
                        <span className="text-green-700 font-bold">{wrong.correctAnswer}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-red-600 font-medium">あなたの回答:</span>
                        <span className="text-red-700">{wrong.userAnswer}</span>
                      </div>
                      <div className="text-xs text-gray-500">
                        {wrong.questionDirection === 'jp-to-en' ? '日→英' : 
                         wrong.questionDirection === 'en-to-jp' ? '英→日' :
                         '例文→英'} · 
                        {wrong.questionType === 'writing' ? ' 記述式' : ' 4択'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="text-xs text-gray-500 mt-2 text-center">
              💡 これらの単語を重点的に復習しましょう
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onResetGame}
            className="bg-gray-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-gray-700 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            モード選択
          </button>
          <button
            onClick={() => onStartGame(gameMode)}
            className="bg-indigo-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-indigo-700 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <Target className="w-4 h-4" />
            同じモード
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultScreen;