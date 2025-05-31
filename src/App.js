import React, { useState, useEffect, useRef } from 'react';

// 単語データ（文字化けしていた部分をUTF-8で修正）
const vocabularyData = [
  { english: "abundance", japanese: "豊富", difficulty: "intermediate" },
  { english: "collaborate", japanese: "協力する", difficulty: "intermediate" },
  { english: "devastating", japanese: "破壊的な", difficulty: "advanced" },
  { english: "enhance", japanese: "向上させる", difficulty: "intermediate" },
  { english: "fundamental", japanese: "基本的な", difficulty: "beginner" },
  { english: "genuine", japanese: "本物の", difficulty: "intermediate" },
  { english: "hypothesis", japanese: "仮説", difficulty: "advanced" },
  { english: "inevitable", japanese: "避けられない", difficulty: "advanced" },
  { english: "justify", japanese: "正当化する", difficulty: "intermediate" },
  { english: "knowledge", japanese: "知識", difficulty: "beginner" }
];

function App() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>英単語学習アプリ</h1>
      <p>Hello World! 日本語テスト</p>
      {vocabularyData.map((word, index) => (
        <div key={index} style={{ margin: '10px 0', padding: '10px', border: '1px solid #ccc' }}>
          <strong>{word.english}</strong> - {word.japanese} ({word.difficulty})
        </div>
      ))}
    </div>
  );
}

export default App;