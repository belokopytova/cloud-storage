import React, { useState, useContext } from 'react';
import { AppContext } from '../../App';

const FileUpload = () => {
  const { handleUpload, loading } = useContext(AppContext);
  const [selectedFile, setSelectedFile] = useState(null);
  const [comment, setComment] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 100 * 1024 * 1024) {
        setError('Файл слишком большой. Максимальный размер: 100MB');
        setSelectedFile(null);
        e.target.value = '';
        return;
      }
      setSelectedFile(file);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('Выберите файл для загрузки');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Имитация прогресса загрузки
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return 95;
          }
          return prev + 5;
        });
      }, 100);

      const result = await handleUpload(selectedFile, comment);
      
      clearInterval(progressInterval);
      setUploadProgress(100);

      if (result.success) {
        // Сброс формы
        setSelectedFile(null);
        setComment('');
        setUploadProgress(0);
        document.getElementById('file-input').value = '';
        alert('Файл успешно загружен!');
      } else {
        setError('Ошибка при загрузке файла');
      }
    } catch (err) {
      setError('Ошибка при загрузке файла');
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(0), 2000);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.style.borderColor = 'var(--red)';
    e.currentTarget.style.background = 'rgba(204, 0, 0, 0.1)';
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.currentTarget.style.borderColor = 'var(--gray-light)';
    e.currentTarget.style.background = 'transparent';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.style.borderColor = 'var(--gray-light)';
    e.currentTarget.style.background = 'transparent';
    
    const file = e.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
      setError('');
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="card">
      <h3 className="card-title">Загрузить файл</h3>
      
      <form onSubmit={handleSubmit}>
        {/* Drag & Drop */}
        <div
          className="drop-zone"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          style={{
            border: `2px dashed ${selectedFile ? 'var(--red)' : 'var(--gray-light)'}`,
            borderRadius: '8px',
            padding: '40px 20px',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.3s',
            background: selectedFile ? 'rgba(204, 0, 0, 0.05)' : 'transparent',
            marginBottom: '16px',
          }}
          onClick={() => document.getElementById('file-input').click()}
        >
          <input
            id="file-input"
            type="file"
            onChange={handleFileChange}
            style={{ display: 'none' }}
            disabled={isUploading || loading}
          />
          
          {selectedFile ? (
            <div>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>
              </div>
              <div style={{ fontWeight: 'bold', color: 'var(--red)' }}>
                {selectedFile.name}
              </div>
              <div className="text-muted" style={{ fontSize: '14px' }}>
                {formatFileSize(selectedFile.size)}
              </div>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ marginTop: '8px', padding: '4px 12px', fontSize: '12px' }}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedFile(null);
                  document.getElementById('file-input').value = '';
                }}
              >
                ✕ Отменить
              </button>
            </div>
          ) : (
            <div>
              <div style={{ fontSize: '48px', marginBottom: '8px' }}></div>
              <div style={{ color: 'var(--text-muted)' }}>
                Перетащите файл сюда или нажмите для выбора
              </div>
              <div className="text-muted" style={{ fontSize: '12px', marginTop: '4px' }}>
                Максимальный размер: 100MB
              </div>
            </div>
          )}
        </div>

        {/* Комментарий */}
        <div className="form-group">
          <label>Комментарий к файлу (опционально)</label>
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Введите комментарий..."
            disabled={isUploading || loading}
            maxLength="200"
          />
          <div className="text-muted" style={{ fontSize: '12px', marginTop: '4px' }}>
            {comment.length}/200
          </div>
        </div>

        {/* Прогресс загрузки */}
        {uploadProgress > 0 && uploadProgress < 100 && (
          <div style={{ marginBottom: '16px' }}>
            <div style={{ 
              background: 'var(--gray)',
              borderRadius: '4px',
              height: '20px',
              overflow: 'hidden',
              position: 'relative'
            }}>
              <div style={{
                width: `${uploadProgress}%`,
                height: '100%',
                background: 'var(--red)',
                transition: 'width 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '12px',
                fontWeight: 'bold'
              }}>
                {uploadProgress}%
              </div>
            </div>
          </div>
        )}

        {/* Ошибки */}
        {error && (
          <div className="error" style={{ marginBottom: '12px' }}>
            {error}
          </div>
        )}

        {/* Кнопка загрузки */}
        <button
          type="submit"
          className="btn btn-primary"
          disabled={!selectedFile || isUploading || loading}
          style={{ width: '100%' }}
        >
          {isUploading ? (
            <span>Загрузка... {uploadProgress}%</span>
          ) : (
            <span>Загрузить файл</span>
          )}
        </button>
      </form>
    </div>
  );
};

export default FileUpload;