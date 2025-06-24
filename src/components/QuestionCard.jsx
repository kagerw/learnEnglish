import React, { useRef, useEffect } from 'react';
import { Lightbulb, Target, CheckCircle, XCircle } from 'lucide-react';
import { createExampleWithBlank, getDifficultyColor } from '../utils/gameUtils';

const QuestionCard = ({
  currentQuestion,
  questionDirection,
  questionType,
  userAnswer,
  setUserAnswer,
  options,
  selectedChoice,
  onSelectChoice,
  onCheckAnswer,
  showHint,
  setShowHint,
  isCorrect,
  timeLeft,
  speedBonus,
  comboMultiplier,
  streak,
  onGoToNextQuestion
}) => {
  const inputRef = useRef(null);

  useEffect(() => {
    if (questionType === 'writing' && inputRef.current) {
      setTimeout(() => {
        inputRef.current.focus();
      }, 100);
    }
  }, [currentQuestion, questionType]);

  if (!currentQuestion) return null;

  const getQuestionText = () => {
    switch (questionDirection) {
      case 'jp-to-en': return currentQuestion.japanese;
      case 'en-to-jp': return currentQuestion.english;
      case 'example-to-en': return createExampleWithBlank(currentQuestion.example, currentQuestion.english);
      default: return '';
    }
  };

  const getInstructionText = () => {
    switch (questionDirection) {
      case 'jp-to-en': 
        return questionType === 'writing' ? '英語で答えてください' : '英語を選択してください';
      case 'en-to-jp':
        return questionType === 'writing' ? '日本語で答えてください' : '日本語を選択してください';
      case 'example-to-en':
        return questionType === 'writing' ? '空欄に入る英単語を答えてください' : '空欄に入る英単語を選択してください';
      default: return '';
    }
  };

  const getPlaceholderText = () => {
    switch (questionDirection) {
      case 'jp-to-en': return '英単語を入力...';
      case 'en-to-jp': return '日本語を入力...';
      case 'example-to-en': return '空欄に入る英単語を入力...';
      default: return '';
    }
  };

  const getHintText = () => {
    switch (questionDirection) {
      case 'jp-to-en': return currentQuestion.hint;
      case 'en-to-jp': return `「${currentQuestion.english}」の意味は「${currentQuestion.japanese}」`;
      case 'example-to-en': return `空欄は${currentQuestion.english.length}文字の単語です`;
      default: return '';
    }
  };

  const getCorrectAnswer = () => {
    switch (questionDirection) {
      case 'jp-to-en':
      case 'example-to-en':
        return currentQuestion.english;
      case 'en-to-jp':
        return currentQuestion.japanese;
      default: return '';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-8 mb-6 relative overflow-hidden">
      {/* バックグラウンドエフェクト */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-purple-50 opacity-50"></div>
      
      <div className="relative z-10">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className={`px-4 py-2 rounded-full text-sm font-medium ${getDifficultyColor(currentQuestion.difficulty)}`}>
              {currentQuestion.difficulty}
            </div>
            {comboMultiplier > 1 && (
              <div className="bg-gradient-to-r from-orange-400 to-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                {comboMultiplier}× COMBO!
              </div>
            )}
          </div>
          
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            {getQuestionText()}
          </h2>
          <p className="text-gray-600 text-lg">
            {getInstructionText()}
          </p>
          
          {/* 例文モードの場合は例文の日本語訳と単語の意味を表示 */}
          {questionDirection === 'example-to-en' && (
            <div className="mt-4 space-y-3">
              {/* 例文の日本語訳 */}
              {currentQuestion.example_jp && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-blue-800 text-sm">
                    🇯🇵 <span className="font-medium">例文訳:</span> {currentQuestion.example_jp}
                  </p>
                </div>
              )}
              
              {/* 空欄に入る単語の意味 */}
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800 text-sm">
                  💡 <span className="font-medium">空欄の単語の意味:</span> {currentQuestion.japanese}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* 入力エリア・選択肢エリア */}
        {questionType === 'writing' ? (
          <div className="max-w-md mx-auto mb-6">
            <input
              ref={inputRef}
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && userAnswer.trim() !== '' && isCorrect === null) {
                  onCheckAnswer();
                }
              }}
              placeholder={getPlaceholderText()}
              disabled={isCorrect !== null}
              className="w-full p-4 text-xl text-center border-2 border-gray-300 rounded-xl focus:border-indigo-500 focus:outline-none transition-all duration-200 bg-white shadow-inner"
            />
          </div>
        ) : (
          <div className="mb-6">
            <div className="grid grid-cols-1 gap-3 max-w-2xl mx-auto">
              {options.map((option, index) => {
                const displayText = questionDirection === 'jp-to-en' || questionDirection === 'example-to-en' 
                  ? option.english : option.japanese;
                const isCorrectChoice = questionDirection === 'jp-to-en' || questionDirection === 'example-to-en'
                  ? option.english === currentQuestion.english
                  : option.japanese === currentQuestion.japanese;
                
                let buttonClass = "w-full p-4 text-left rounded-lg border-2 transition-all duration-200 transform hover:scale-102";
                
                if (selectedChoice === null) {
                  buttonClass += " border-gray-200 hover:border-indigo-300 hover:bg-indigo-50";
                } else if (isCorrectChoice) {
                  buttonClass += " border-green-500 bg-green-50 text-green-700";
                } else if (option === selectedChoice) {
                  buttonClass += " border-red-500 bg-red-50 text-red-700";
                } else {
                  buttonClass += " border-gray-200 bg-gray-50 text-gray-500";
                }

                return (
                  <button
                    key={index}
                    onClick={() => onSelectChoice(option)}
                    className={buttonClass}
                    disabled={selectedChoice !== null}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-lg">{displayText}</span>
                      {selectedChoice !== null && isCorrectChoice && (
                        <div className="text-green-600 text-xl">✓</div>
                      )}
                      {selectedChoice === option && !isCorrectChoice && (
                        <div className="text-red-600 text-xl">✗</div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ボタン */}
        <div className="flex justify-center gap-4 mb-6">
          {isCorrect === null ? (
            <>
              {questionType === 'writing' && (
                <button
                  onClick={onCheckAnswer}
                  disabled={userAnswer.trim() === ''}
                  className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:transform-none shadow-lg"
                >
                  回答する
                </button>
              )}
              
              {!showHint && (
                <button
                  onClick={() => setShowHint(true)}
                  className="bg-yellow-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-yellow-600 transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center gap-2"
                >
                  <Lightbulb className="w-4 h-4" />
                  ヒント
                </button>
              )}
            </>
          ) : (
            <button
              onClick={onGoToNextQuestion}
              className="bg-green-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-green-700 transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center gap-2"
            >
              次の問題へ
              <Target className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* ヒント表示 */}
        {showHint && questionType === 'writing' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 text-center">
            <div className="text-yellow-800">
              💡 {getHintText()}
            </div>
          </div>
        )}

        {/* フィードバック */}
        {isCorrect !== null && (
          <div className={`p-6 rounded-xl text-center ${
            isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
          }`}>
            <div className={`flex items-center justify-center gap-2 text-xl font-bold mb-2 ${
              isCorrect ? 'text-green-800' : 'text-red-800'
            }`}>
              {isCorrect ? <CheckCircle className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
              {isCorrect ? '正解！' : timeLeft === 0 ? 'タイムアップ！' : '不正解'}
            </div>
            
            <div className="text-gray-700 mb-2">
              正解: <span className="font-bold text-lg">
                {getCorrectAnswer()}
              </span>
            </div>
            
            {isCorrect && (
              <div className="space-y-1 text-sm text-green-700">
                {speedBonus > 0 && <div>⚡ スピードボーナス: +{speedBonus}pt</div>}
                {!showHint && <div>💡 ヒント未使用ボーナス: +5pt</div>}
                {questionType === 'writing' && <div>✍️ 英作文ボーナス: +5pt</div>}
                {comboMultiplier > 1 && <div>🔥 コンボボーナス: ×{comboMultiplier}</div>}
                {streak >= 5 && <div>🔥 連続正解ボーナス!</div>}
              </div>
            )}
            
            <div className="text-sm text-gray-600 mt-3">
              {questionType === 'writing' ? 'Enterキーでも次に進めます' : '選択肢をクリックして回答'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionCard;