import { useState } from 'react';
import { vocabularyData } from '../data/vocabularyData';
import { processCSVFile } from '../utils/csvProcessor';

export const useVocabularyData = () => {
  const [currentVocabularyData, setCurrentVocabularyData] = useState(vocabularyData);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [encoding, setEncoding] = useState('Shift_JIS');

  // CSVファイル処理
  const handleFileUpload = async (file) => {
    if (!file) return;

    setIsUploading(true);
    setUploadError('');

    try {
      const words = await processCSVFile(file, encoding);
      setCurrentVocabularyData(words);
      setUploadedFileName(file.name);
      setIsUploading(false);
    } catch (error) {
      setUploadError(error.message);
      setIsUploading(false);
    }
  };

  // デフォルトデータに戻す
  const resetToDefaultData = () => {
    setCurrentVocabularyData(vocabularyData);
    setUploadedFileName('');
    setUploadError('');
    setEncoding('Shift_JIS');
  };

  return {
    currentVocabularyData,
    uploadedFileName,
    isUploading,
    uploadError,
    encoding,
    setEncoding,
    handleFileUpload,
    resetToDefaultData
  };
};