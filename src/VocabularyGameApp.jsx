import React, { useState, useEffect, useRef } from 'react';
import { Zap, Clock, Target, Star, RotateCcw, BookOpen, Award, Lightbulb, CheckCircle, XCircle, Trophy, Upload, FileText, AlertCircle } from 'lucide-react';

// 単語データベース（後で拡張可能）
const vocabularyData = [
  { english: "abundance", japanese: "豊富、大量", difficulty: "advanced", hint: "a から始まる、たくさんあること", example: "There is an abundance of fresh fruit in the market.", example_jp: "市場には新鮮な果物が豊富にある。" },
  { english: "collaborate", japanese: "協力する", difficulty: "intermediate", hint: "c から始まる、一緒に働くこと", example: "We need to collaborate with other teams to finish this project.", example_jp: "このプロジェクトを終わらせるために他のチームと協力する必要がある。" },
  { english: "devastating", japanese: "破壊的な", difficulty: "advanced", hint: "d から始まる、大きな被害を与える", example: "The earthquake had a devastating effect on the city.", example_jp: "地震は街に破壊的な影響を与えた。" },
  { english: "enhance", japanese: "向上させる", difficulty: "intermediate", hint: "e から始まる、より良くすること", example: "This software will enhance your productivity at work.", example_jp: "このソフトウェアは職場での生産性を向上させるでしょう。" },
  { english: "fundamental", japanese: "基本的な", difficulty: "intermediate", hint: "f から始まる、土台となる", example: "Understanding grammar is fundamental to learning any language.", example_jp: "文法を理解することはどの言語を学ぶにも基本的なことです。" },
  { english: "genuine", japanese: "本物の、真の", difficulty: "intermediate", hint: "g から始まる、偽物でない", example: "She showed genuine concern for her friend's wellbeing.", example_jp: "彼女は友人の健康を心から心配していた。" },
  { english: "hypothesis", japanese: "仮説", difficulty: "advanced", hint: "h から始まる、科学的な推測", example: "The scientist tested his hypothesis through careful experiments.", example_jp: "科学者は慎重な実験を通じて仮説を検証した。" },
  { english: "inevitable", japanese: "避けられない", difficulty: "advanced", hint: "i から始まる、必ず起こること", example: "Change is inevitable in today's fast-paced world.", example_jp: "今日の急速に変化する世界では変化は避けられない。" },
  { english: "justify", japanese: "正当化する", difficulty: "intermediate", hint: "j から始まる、理由を説明する", example: "Can you justify spending so much money on this project?", example_jp: "このプロジェクトにそんなにお金をかけることを正当化できますか？" },
  { english: "knowledge", japanese: "知識", difficulty: "basic", hint: "k から始まる、学んだ情報", example: "His knowledge of history is quite impressive.", example_jp: "彼の歴史の知識はかなり印象的だ。" },
  { english: "limitation", japanese: "制限", difficulty: "intermediate", hint: "l から始まる、制約すること", example: "Budget limitation forced us to reduce the project scope.", example_jp: "予算の制限により、プロジェクトの範囲を縮小せざるを得なかった。" },
  { english: "magnificent", japanese: "壮大な", difficulty: "intermediate", hint: "m から始まる、素晴らしく立派な", example: "The view from the mountain top was absolutely magnificent.", example_jp: "山頂からの眺めは本当に壮大だった。" },
  { english: "negotiate", japanese: "交渉する", difficulty: "intermediate", hint: "n から始まる、話し合いで決める", example: "The union will negotiate with management about salary increases.", example_jp: "組合は給与増額について経営陣と交渉する。" },
  { english: "opportunity", japanese: "機会", difficulty: "basic", hint: "o から始まる、チャンス", example: "This internship is a great opportunity to gain work experience.", example_jp: "このインターンシップは職務経験を積む絶好の機会だ。" },
  { english: "perspective", japanese: "視点", difficulty: "intermediate", hint: "p から始まる、物事の見方", example: "Looking at the problem from a different perspective might help.", example_jp: "異なる視点から問題を見ることが役立つかもしれない。" },
  { english: "quality", japanese: "品質", difficulty: "basic", hint: "q から始まる、物の良さ", example: "The quality of their customer service is excellent.", example_jp: "彼らのカスタマーサービスの品質は素晴らしい。" },
  { english: "reasonable", japanese: "合理的な", difficulty: "intermediate", hint: "r から始まる、理にかなった", example: "Your request seems reasonable and we can accommodate it.", example_jp: "あなたの要求は合理的に思えるので対応できます。" },
  { english: "significant", japanese: "重要な", difficulty: "intermediate", hint: "s から始まる、大切な意味がある", example: "There has been a significant improvement in sales this quarter.", example_jp: "今四半期は売上に大きな改善があった。" },
  { english: "tremendous", japanese: "途方もない", difficulty: "advanced", hint: "t から始まる、とても大きな", example: "The team made a tremendous effort to meet the deadline.", example_jp: "チームは締切に間に合わせるために途方もない努力をした。" },
  { english: "understand", japanese: "理解する", difficulty: "basic", hint: "u から始まる、意味が分かる", example: "Do you understand the instructions for this assignment?", example_jp: "この課題の指示を理解していますか？" }
];

const VocabularyGameApp = () => {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
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
  const [currentVocabularyData, setCurrentVocabularyData] = useState(vocabularyData);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [encoding, setEncoding] = useState('Shift_JIS'); // デフォルトをShift_JISに
  const [maxQuestions, setMaxQuestions] = useState(10); // 問題数制限
  const [options, setOptions] = useState([]); // 4択の選択肢
  const [selectedChoice, setSelectedChoice] = useState(null); // 選択した選択肢
  const [wrongAnswers, setWrongAnswers] = useState([]); // 間違えた単語記録
  const inputRef = useRef(null);
  const timerRef = useRef(null);
  const fileInputRef = useRef(null);

  // タイマー管理
  useEffect(() => {
    if (gameStarted && !showResult && currentQuestion && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && currentQuestion) {
      // タイムオーバー
      handleTimeOut();
    }
    return () => clearTimeout(timerRef.current);
  }, [timeLeft, gameStarted, showResult, currentQuestion]);

  // ゲーム開始フラグを監視して問題生成
  useEffect(() => {
    if (gameStarted && !showResult && usedQuestions.length === 0 && !currentQuestion) {
      generateQuestion(true);
    }
  }, [gameStarted, showResult, usedQuestions, currentQuestion]);

  // グローバルキーボードイベント管理
  useEffect(() => {
    const handleGlobalKeyPress = (e) => {
      if (!gameStarted || showResult) return;
      
      if (e.key === 'Enter') {
        if (isCorrect === null && questionType === 'writing' && userAnswer.trim() !== '') {
          // 未回答で入力がある場合は回答
          checkAnswer();
        } else if (isCorrect !== null) {
          // 既に回答済みの場合は次の問題へ
          goToNextQuestion();
        }
      }
    };

    document.addEventListener('keydown', handleGlobalKeyPress);
    return () => document.removeEventListener('keydown', handleGlobalKeyPress);
  }, [gameStarted, showResult, isCorrect, questionType, userAnswer]);

  // CSVファイル処理
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      setUploadError('CSVファイルを選択してください');
      return;
    }

    setIsUploading(true);
    setUploadError('');

    try {
      const fileContent = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = (e) => reject(e);
        reader.readAsText(file, encoding); // 選択されたエンコードを使用
      });

      // CSVパース（シンプルな実装）
      const lines = fileContent.split('\n').filter(line => line.trim());
      const words = [];

      // 1行目はヘッダーとしてスキップ
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const [english, japanese, example, example_jp] = line.split(',').map(item => item ? item.trim() : '');
        
        if (!english || !japanese) {
          setUploadError(`${i + 1}行目のフォーマットが正しくありません（英単語と日本語は必須）`);
          setIsUploading(false);
          return;
        }

        // 難易度自動判定（文字数とよく使われる語彙で判断）
        let difficulty = 'basic';
        if (english.length > 8 || /[A-Z].*[A-Z]/.test(english)) {
          difficulty = 'advanced';
        } else if (english.length > 5) {
          difficulty = 'intermediate';
        }

        // ヒント自動生成
        const hint = `${english.charAt(0).toLowerCase()} から始まる${english.length}文字の単語`;

        words.push({
          english: english.toLowerCase(),
          japanese,
          example: example || '', // 例文が空の場合もあり得る
          example_jp: example_jp || '', // 例文の日本語訳が空の場合もあり得る
          difficulty,
          hint
        });
      }

      if (words.length === 0) {
        setUploadError('有効な単語データが見つかりませんでした');
        setIsUploading(false);
        return;
      }

      setCurrentVocabularyData(words);
      setUploadedFileName(file.name);
      setIsUploading(false);

    } catch (error) {
      setUploadError('ファイルの読み込みに失敗しました');
      setIsUploading(false);
    }
  };

  // デフォルトデータに戻す
  const resetToDefaultData = () => {
    setCurrentVocabularyData(vocabularyData);
    setUploadedFileName('');
    setUploadError('');
    setEncoding('Shift_JIS'); // エンコードもリセット
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // 例文から単語を空欄にする
  const createExampleWithBlank = (example, targetWord) => {
    if (!example) return '';
    
    // 大文字小文字を無視して単語を検索し、空欄に置き換える
    const regex = new RegExp(`\\b${targetWord}\\b`, 'gi');
    const blankLength = targetWord.length;
    const blank = '_'.repeat(Math.max(3, Math.min(blankLength, 8))); // 3-8文字の空欄
    
    return example.replace(regex, `(${blank})`);
  };

  // 新しい問題を生成
  const generateQuestion = (forceStart = false) => {
    // ゲーム開始時は制限チェックをスキップ
    if (!forceStart) {
      // 問題数制限チェック（maxQuestions が 0 の場合は全問なので制限なし）
      const maxQuestionsLimit = maxQuestions === 0 ? currentVocabularyData.length : maxQuestions;
      if (questionCount >= maxQuestionsLimit) {
        setShowResult(true);
        return;
      }
    }

    // 例文→単語モードの場合は、例文がある単語のみフィルタリング
    let availableQuestions = currentVocabularyData.filter(word => !usedQuestions.includes(word.english));
    
    if (questionDirection === 'example-to-en') {
      availableQuestions = availableQuestions.filter(word => word.example && word.example.trim() !== '');
      
      if (availableQuestions.length === 0) {
        setUploadError('例文モード用のデータが不足しています。CSVファイルの3列目に例文を追加してください。');
        return;
      }
    }
    
    // 利用可能な問題がない場合はゲーム終了
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
    setTimeLeft(gameMode === 'speed' ? 15 : 30);
    setSpeedBonus(0);
    
    // 4択問題の場合は選択肢を生成
    if (questionType === 'choice') {
      generateChoices(randomWord);
    } else {
      setOptions([]);
    }
    
    // 入力フィールドにフォーカス（英作文の場合）
    if (questionType === 'writing') {
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 100);
    }
  };

  // 4択の選択肢を生成
  const generateChoices = (correctWord) => {
    const wrongAnswers = currentVocabularyData
      .filter(word => word.english !== correctWord.english)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    const allChoices = [correctWord, ...wrongAnswers].sort(() => Math.random() - 0.5);
    setOptions(allChoices);
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
    
    const isAnswerCorrect = questionDirection === 'en-to-jp' 
      ? userInput === correctAnswer
      : userInput === correctAnswer;

    processAnswer(isAnswerCorrect, userInput);
  };

  // 4択回答を選択
  const selectChoice = (selectedWord) => {
    if (selectedChoice !== null) return; // 既に回答済み

    setSelectedChoice(selectedWord);
    
    let isAnswerCorrect;
    if (questionDirection === 'jp-to-en' || questionDirection === 'example-to-en') {
      isAnswerCorrect = selectedWord.english === currentQuestion.english;
    } else if (questionDirection === 'en-to-jp') {
      isAnswerCorrect = selectedWord.japanese === currentQuestion.japanese;
    }
    
    // 選択した回答を直接渡す
    const selectedAnswer = questionDirection === 'jp-to-en' || questionDirection === 'example-to-en' 
      ? selectedWord.english 
      : selectedWord.japanese;
    
    processAnswer(isAnswerCorrect, selectedAnswer);
  };

  // 回答結果を処理
  const processAnswer = (isAnswerCorrect, providedAnswer = null) => {
    setIsCorrect(isAnswerCorrect);

    if (isAnswerCorrect) {
      // 正解時の処理
      let points = 10;
      
      // 難易度ボーナス
      if (currentQuestion.difficulty === 'intermediate') points += 5;
      if (currentQuestion.difficulty === 'advanced') points += 10;
      
      // 速度ボーナス
      const speedBonusPoints = Math.max(0, Math.floor((timeLeft / (gameMode === 'speed' ? 15 : 30)) * 20));
      setSpeedBonus(speedBonusPoints);
      points += speedBonusPoints;
      
      // コンボボーナス
      points *= comboMultiplier;
      
      // ヒント未使用ボーナス
      if (!showHint) points += 5;

      // 問題タイプボーナス（英作文の方が難しいので）
      if (questionType === 'writing') points += 5;

      setScore(prev => prev + points);
      setStreak(prev => prev + 1);
      setMaxStreak(prev => Math.max(prev, streak + 1));
      setCorrectCount(prev => prev + 1);
      
      // コンボ倍率更新
      if (streak >= 4) setComboMultiplier(prev => Math.min(prev + 0.5, 3));
      
    } else {
      // 不正解時の処理
      setStreak(0);
      setComboMultiplier(1);
      
      // 間違えた単語を記録（選択した回答を優先使用）
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

    // 問題数を増加
    const newQuestionCount = questionCount + 1;
    setQuestionCount(newQuestionCount);
    
    // ゲーム終了判定
    const maxQuestionsLimit = maxQuestions === 0 ? currentVocabularyData.length : maxQuestions;
    if (newQuestionCount >= maxQuestionsLimit) {
      // 次の問題生成をスキップしてゲーム終了
      setTimeout(() => {
        setShowResult(true);
      }, 1500);
    }
  };

  // タイムアウト処理
  const handleTimeOut = () => {
    setIsCorrect(false);
    setStreak(0);
    setComboMultiplier(1);
    
    // 問題数を増加
    const newQuestionCount = questionCount + 1;
    setQuestionCount(newQuestionCount);
    
    // タイムアウトした単語を記録
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
    
    // ゲーム終了判定
    const maxQuestionsLimit = maxQuestions === 0 ? currentVocabularyData.length : maxQuestions;
    if (newQuestionCount >= maxQuestionsLimit) {
      setTimeout(() => {
        setShowResult(true);
      }, 1500);
    }
  };

  // 次の問題へ進む
  const goToNextQuestion = () => {
    // ゲーム終了判定
    const maxQuestionsLimit = maxQuestions === 0 ? currentVocabularyData.length : maxQuestions;
    if (questionCount >= maxQuestionsLimit) {
      setShowResult(true);
      return;
    }
    
    generateQuestion();
  };

  // ゲーム開始
  const startGame = (speed = 'normal') => {
    // 全ての状態を完全にリセット
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
    setTimeLeft(30);
    setIsCorrect(null);
    setShowHint(false);
    setUsedQuestions([]);
    setWrongAnswers([]);
    setComboMultiplier(1);
    setSpeedBonus(0);
    setOptions([]);
    setSelectedChoice(null);
    
    // useEffectで状態リセット完了後に問題生成される
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
    setTimeLeft(30);
    setIsCorrect(null);
    setShowHint(false);
    setUsedQuestions([]);
    setWrongAnswers([]);
    setComboMultiplier(1);
    setSpeedBonus(0);
    setOptions([]);
    setSelectedChoice(null);
  };

  // 難易度別の色
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'basic': return 'text-green-600 bg-green-100';
      case 'intermediate': return 'text-yellow-600 bg-yellow-100';
      case 'advanced': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  // スタート画面
  if (!gameStarted) {
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
          <div className="mb-8 p-6 bg-gray-50 rounded-2xl">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center justify-center gap-2">
              <Upload className="w-5 h-5" />
              CSVファイルから単語を読み込み
            </h3>
            
            {uploadedFileName ? (
              <div className="mb-4">
                <div className="bg-green-100 border border-green-200 rounded-lg p-3 mb-3">
                  <div className="flex items-center justify-center gap-2 text-green-800">
                    <FileText className="w-4 h-4" />
                    <span className="font-medium">{uploadedFileName}</span>
                  </div>
                  <div className="text-sm text-green-600 mt-1">
                    {currentVocabularyData.length}個の単語を読み込みました
                  </div>
                </div>
                <button
                  onClick={resetToDefaultData}
                  className="text-sm text-gray-600 hover:text-gray-800 underline"
                >
                  デフォルトデータに戻す
                </button>
              </div>
            ) : (
              <div className="mb-4">
                {/* エンコード選択 */}
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    文字エンコード
                  </label>
                  <select
                    value={encoding}
                    onChange={(e) => setEncoding(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 text-sm"
                  >
                    <option value="Shift_JIS">Shift_JIS</option>
                    <option value="UTF-8">UTF-8</option>
                    <option value="EUC-JP">EUC-JP</option>
                  </select>
                </div>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                  className="hidden"
                  id="csv-upload"
                />
                <label
                  htmlFor="csv-upload"
                  className={`block w-full p-4 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-200 ${
                    isUploading 
                      ? 'border-gray-300 bg-gray-100 cursor-not-allowed' 
                      : 'border-indigo-300 hover:border-indigo-500 hover:bg-indigo-50'
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <Upload className={`w-6 h-6 ${isUploading ? 'text-gray-400' : 'text-indigo-500'}`} />
                    <span className={`text-sm ${isUploading ? 'text-gray-400' : 'text-gray-700'}`}>
                      {isUploading ? '読み込み中...' : 'CSVファイルを選択'}
                    </span>
                  </div>
                </label>
                
                <div className="text-xs text-gray-500 mt-2 space-y-1">
                  <p>フォーマット: 英単語,日本語,例文,例文の日本語訳</p>
                  <p>3列目・4列目は例文モード用（省略可）</p>
                  <p>1行目はヘッダー行として自動スキップされます</p>
                  <p>推奨エンコード: Shift_JIS (日本語Excel標準)</p>
                </div>
              </div>
            )}
            
            {uploadError && (
              <div className="bg-red-100 border border-red-200 rounded-lg p-3 mb-4">
                <div className="flex items-center gap-2 text-red-800">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm">{uploadError}</span>
                </div>
              </div>
            )}
          </div>
          
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
              onClick={() => startGame('normal')}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <div className="flex items-center justify-center gap-2">
                <Target className="w-5 h-5" />
                ノーマルモード
              </div>
              <div className="text-xs opacity-90 mt-1">30秒でじっくり考える</div>
            </button>
            
            <button
              onClick={() => startGame('speed')}
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
  }

  // 結果画面
  if (showResult) {
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
              onClick={resetGame}
              className="bg-gray-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-gray-700 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              モード選択
            </button>
            <button
              onClick={() => startGame(gameMode)}
              className="bg-indigo-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-indigo-700 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Target className="w-4 h-4" />
              同じモード
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ゲーム画面
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* ヘッダー */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-4 mb-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-white">
                {questionDirection === 'jp-to-en' ? '英作文チャレンジ' : 
                 questionDirection === 'en-to-jp' ? '英語学習クイズ' : 
                 '例文穴埋めクイズ'}
              </h1>
              <div className="flex items-center gap-2 text-sm">
                <div className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs">
                  {gameMode === 'speed' ? 'SPEED' : 'NORMAL'}
                </div>
                <div className="bg-purple-500 text-white px-2 py-1 rounded-full text-xs">
                  {questionDirection === 'jp-to-en' ? '日→英' : 
                   questionDirection === 'en-to-jp' ? '英→日' : 
                   '例文→英'}
                </div>
                <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs">
                  {questionType === 'writing' ? 
                    (questionDirection === 'jp-to-en' ? '英作文' : 
                     questionDirection === 'en-to-jp' ? '日本語' : 
                     '穴埋め') : '4択'}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-white font-bold text-lg">
                第{Math.min(questionCount + 1, maxQuestions === 0 ? currentVocabularyData.length : maxQuestions)}問 / 全{maxQuestions === 0 ? currentVocabularyData.length : maxQuestions}問
              </div>
              <button
                onClick={resetGame}
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

        {/* 問題カード */}
        {currentQuestion && (
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
                  {questionDirection === 'jp-to-en' ? currentQuestion.japanese : 
                   questionDirection === 'en-to-jp' ? currentQuestion.english :
                   createExampleWithBlank(currentQuestion.example, currentQuestion.english)}
                </h2>
                <p className="text-gray-600 text-lg">
                  {questionDirection === 'jp-to-en' ? 
                    (questionType === 'writing' ? '英語で答えてください' : '英語を選択してください') :
                   questionDirection === 'en-to-jp' ?
                    (questionType === 'writing' ? '日本語で答えてください' : '日本語を選択してください') :
                    (questionType === 'writing' ? '空欄に入る英単語を答えてください' : '空欄に入る英単語を選択してください')
                  }
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
                        checkAnswer();
                      }
                    }}
                    placeholder={questionDirection === 'jp-to-en' ? '英単語を入力...' : 
                               questionDirection === 'en-to-jp' ? '日本語を入力...' :
                               '空欄に入る英単語を入力...'}
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
                          onClick={() => selectChoice(option)}
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
                        onClick={checkAnswer}
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
                    onClick={goToNextQuestion}
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
                    💡 {questionDirection === 'jp-to-en' ? currentQuestion.hint : 
                        questionDirection === 'en-to-jp' ? `「${currentQuestion.english}」の意味は「${currentQuestion.japanese}」` :
                        `空欄は${currentQuestion.english.length}文字の単語です`}
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
                  
                  {!isCorrect && (
                    <div className="text-gray-700 mb-2">
                      正解: <span className="font-bold text-lg">
                        {questionDirection === 'jp-to-en' || questionDirection === 'example-to-en' 
                          ? currentQuestion.english 
                          : currentQuestion.japanese}
                      </span>
                    </div>
                  )}
                  
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
        )}
      </div>
    </div>
  );
};

export default VocabularyGameApp;
