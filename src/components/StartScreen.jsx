import React from 'react';
import { BookOpen, Zap, Target } from 'lucide-react';
import FileUpload from './FileUpload';

const StartScreen = ({ 
  questionDirection, 
  setQuestionDirection,
  questionType, 
  setQuestionType,
  maxQuestions, 
  setMaxQuestions,
  currentVocabularyData,
  onStartGame,
  // FileUpload props
  uploadedFileName,
  isUploading,
  uploadError,
  encoding,
  setEncoding,
  onFileUpload,
  onResetToDefault
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-lg w-full text-center">
        <div className="mb-8">
          <div className="relative mb-6">
            <BookOpen className="w-20 h-20 mx-auto text-indigo-600 mb-4" />
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
              <Zap className="w-4 h-4 text-yellow-800" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            英語学習ゲーム
          </h1>
          <p className="text-gray-600">多彩な学習モードで楽しく英語をマスター！</p>
        </div>
        
        {/* ファイルアップロードセクション */}
        <FileUpload
          uploadedFileName={uploadedFileName}
          isUploading={isUploading}
          uploadError={uploadError}
          encoding={encoding}
          setEncoding={setEncoding}
          onFileUpload={onFileUpload}
          onResetToDefault={onResetToDefault}
        />
        
        {/* 問題数・ゲームモード選択 */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">ゲーム設定</h3>
          
          {/* 出題方向選択 */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              出題方向
            </label>
            <div className="grid grid-cols-1 gap-2">
              <button
                onClick={() => setQuestionDirection('jp-to-en')}
                className={`py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                  questionDirection === 'jp-to-en'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                日本語 → 英語
              </button>
              <button
                onClick={() => setQuestionDirection('en-to-jp')}
                className={`py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                  questionDirection === 'en-to-jp'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                英語 → 日本語
              </button>
              <button
                onClick={() => setQuestionDirection('example-to-en')}
                className={`py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                  questionDirection === 'example-to-en'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                例文 → 英単語
                <div className="text-xs mt-1 opacity-80">銀のフレーズ式</div>
              </button>
            </div>
          </div>

          {/* 問題形式選択 */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              問題形式
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setQuestionType('writing')}
                className={`py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                  questionType === 'writing'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {questionDirection === 'jp-to-en' ? '英作文' : 
                 questionDirection === 'en-to-jp' ? '日本語入力' :
                 '穴埋め入力'}
                <div className="text-xs mt-1 opacity-80">+5pt ボーナス</div>
              </button>
              <button
                onClick={() => setQuestionType('choice')}
                className={`py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                  questionType === 'choice'
                    ? 'bg-orange-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                4択問題
                <div className="text-xs mt-1 opacity-80">スピーディー</div>
              </button>
            </div>
          </div>
          
          {/* 問題数選択 */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              問題数
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[5, 10, 20, 0].map((num) => (
                <button
                  key={num}
                  onClick={() => setMaxQuestions(num)}
                  className={`py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    maxQuestions === num
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {num === 0 ? '全問' : `${num}問`}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mb-8 grid grid-cols-2 gap-4 text-sm">
          <div className="bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-lg p-3">
            <div className="font-bold text-lg">{currentVocabularyData.length}</div>
            <div>収録単語</div>
          </div>
          <div className="bg-gradient-to-r from-purple-400 to-pink-500 text-white rounded-lg p-3">
            <div className="font-bold text-lg">
              {maxQuestions === 0 ? currentVocabularyData.length : Math.min(maxQuestions, currentVocabularyData.length)}
            </div>
            <div>出題予定</div>
          </div>
        </div>

        <div className="space-y-3 mb-8">
          <button
            onClick={() => onStartGame('normal')}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            <div className="flex items-center justify-center gap-2">
              <Target className="w-5 h-5" />
              ノーマルモード
            </div>
            <div className="text-xs opacity-90 mt-1">30秒でじっくり考える</div>
          </button>
          
          <button
            onClick={() => onStartGame('speed')}
            className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-orange-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            <div className="flex items-center justify-center gap-2">
              <Zap className="w-5 h-5" />
              スピードモード
            </div>
            <div className="text-xs opacity-90 mt-1">15秒の高速回答</div>
          </button>
        </div>

        <div className="text-xs text-gray-500 space-y-1">
          <p>💡 ヒント機能で学習サポート</p>
          <p>🔥 連続正解でコンボボーナス</p>
          <p>⚡ 速答でスピードボーナス</p>
          <p>✍️ 英作文でさらにボーナス</p>
        </div>
      </div>
    </div>
  );
};

export default StartScreen;