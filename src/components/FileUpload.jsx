import React, { useRef } from 'react';
import { Upload, FileText, AlertCircle } from 'lucide-react';

const FileUpload = ({ 
  uploadedFileName, 
  isUploading, 
  uploadError, 
  encoding, 
  setEncoding, 
  onFileUpload, 
  onResetToDefault 
}) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      onFileUpload(file);
    }
  };

  const handleReset = () => {
    onResetToDefault();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
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
          </div>
          <button
            onClick={handleReset}
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
            onChange={handleFileChange}
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
  );
};

export default FileUpload;