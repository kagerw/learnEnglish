// ゲーム関連のユーティリティ関数

// 例文から単語を空欄にする
export const createExampleWithBlank = (example, targetWord) => {
  if (!example) return '';
  
  // 大文字小文字を無視して単語を検索し、空欄に置き換える
  const regex = new RegExp(`\\b${targetWord}\\b`, 'gi');
  const blankLength = targetWord.length;
  const blank = '_'.repeat(Math.max(3, Math.min(blankLength, 8))); // 3-8文字の空欄
  
  return example.replace(regex, `(${blank})`);
};

// スコア計算
export const calculateScore = (baseScore, currentQuestion, gameMode, timeLeft, showHint, questionType, comboMultiplier) => {
  let points = baseScore;
  
  // 難易度ボーナス
  if (currentQuestion.difficulty === 'intermediate') points += 5;
  if (currentQuestion.difficulty === 'advanced') points += 10;
  
  // 速度ボーナス
  const maxTime = gameMode === 'speed' ? 15 : 30;
  const speedBonusPoints = Math.max(0, Math.floor((timeLeft / maxTime) * 20));
  points += speedBonusPoints;
  
  // コンボボーナス
  points *= comboMultiplier;
  
  // ヒント未使用ボーナス
  if (!showHint) points += 5;

  // 問題タイプボーナス（英作文の方が難しいので）
  if (questionType === 'writing') points += 5;

  return { totalPoints: points, speedBonus: speedBonusPoints };
};

// 難易度別の色
export const getDifficultyColor = (difficulty) => {
  switch (difficulty) {
    case 'basic': return 'text-green-600 bg-green-100';
    case 'intermediate': return 'text-yellow-600 bg-yellow-100';
    case 'advanced': return 'text-red-600 bg-red-100';
    default: return 'text-gray-600 bg-gray-100';
  }
};

// 4択の選択肢を生成
export const generateChoices = (correctWord, vocabularyData) => {
  const wrongAnswers = vocabularyData
    .filter(word => word.english !== correctWord.english)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);

  return [correctWord, ...wrongAnswers].sort(() => Math.random() - 0.5);
};

// 回答の正誤判定
export const checkAnswerCorrectness = (userInput, correctAnswer, questionDirection) => {
  if (questionDirection === 'en-to-jp') {
    return userInput.trim() === correctAnswer;
  } else {
    return userInput.trim().toLowerCase() === correctAnswer.toLowerCase();
  }
};