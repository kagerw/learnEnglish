// CSVファイル処理ユーティリティ

export const processCSVFile = async (file, encoding = 'Shift_JIS') => {
  if (!file.name.endsWith('.csv')) {
    throw new Error('CSVファイルを選択してください');
  }

  const fileContent = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = (e) => reject(e);
    reader.readAsText(file, encoding);
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
      throw new Error(`${i + 1}行目のフォーマットが正しくありません（英単語と日本語は必須）`);
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
      example: example || '',
      example_jp: example_jp || '',
      difficulty,
      hint
    });
  }

  if (words.length === 0) {
    throw new Error('有効な単語データが見つかりませんでした');
  }

  return words;
};