// components/files/FileActions.jsx
import React, { useState, useContext } from 'react';
import { AppContext } from '../../App';

const FileActions = ({ file, onActionComplete }) => {
  const { handleRenameFile, handleDeleteFile } = useContext(AppContext);
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(file.name);
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [comment, setComment] = useState(file.comment || '');
  const [showActions, setShowActions] = useState(false);

  const handleRename = async () => {
    if (newName.trim() && newName !== file.name) {
      await handleRenameFile(file.id, newName);
      if (onActionComplete) onActionComplete();
    }
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (window.confirm(`Удалить файл "${file.name}"?`)) {
      await handleDeleteFile(file.id);
      if (onActionComplete) onActionComplete();
    }
  };

  const handleDownload = () => {
    // Скачивание через скрытую ссылку
    const link = document.createElement('a');
    link.href = `${process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1'}/files/${file.id}/download/`;
    link.setAttribute('download', file.name);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleCopyShareLink = async () => {
    try {
      const shareLink = `${window.location.origin}/share/${file.id}`;
      await navigator.clipboard.writeText(shareLink);
      alert('Ссылка скопирована в буфер обмена!');
    } catch (err) {
      alert('Ошибка при копировании ссылки');
    }
  };

  const handleOpenInBrowser = () => {
    window.open(
      `${process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1'}/files/${file.id}/download/`,
      '_blank'
    );
  };

  const formatSize = (bytes) => {
    if (!bytes) return '0 B';
    const units = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${units[i]}`;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString('ru-RU');
  };

  return (
    <div className="file-actions" style={{ 
      background: 'var(--black)',
      border: '1px solid var(--gray)',
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '12px'
    }}>
      <div className="flex-between">
        <div style={{ flex: 1 }}>
          {isEditing ? (
            <div className="flex gap-10">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleRename()}
                autoFocus
                style={{
                  background: 'var(--gray)',
                  color: 'white',
                  border: '1px solid var(--red)',
                  borderRadius: '4px',
                  padding: '4px 8px',
                  flex: 1
                }}
              />
              <button className="btn btn-primary" onClick={handleRename} style={{ padding: '4px 12px' }}>
                
              </button>
              <button className="btn btn-secondary" onClick={() => setIsEditing(false)} style={{ padding: '4px 12px' }}>
                ✕
              </button>
            </div>
          ) : (
            <div>
              <div style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--text)' }}>
                {file.name}
              </div>
              <div className="text-muted" style={{ fontSize: '13px', marginTop: '4px' }}>
                <span>{formatSize(file.size)}</span>
                <span style={{ margin: '0 8px' }}>•</span>
                <span>{formatDate(file.uploaded_at)}</span>
                {file.last_downloaded_at && (
                  <>
                    <span style={{ margin: '0 8px' }}>•</span>
                    <span>{formatDate(file.last_downloaded_at)}</span>
                  </>
                )}
              </div>
              {file.comment && (
                <div className="text-muted" style={{ fontSize: '13px', marginTop: '4px' }}>
                   {file.comment}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Кнопка показать/скрыть действия */}
        <button
          className="btn btn-secondary"
          onClick={() => setShowActions(!showActions)}
          style={{ padding: '4px 12px' }}
        >
          {showActions ? '▲' : '▼'} Действия
        </button>
      </div>

      {/* Панель действий */}
      {showActions && (
        <div style={{ 
          marginTop: '12px',
          paddingTop: '12px',
          borderTop: '1px solid var(--gray)',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px'
        }}>
          {/* Переименовать */}
          <button
            className="btn btn-secondary"
            onClick={() => setIsEditing(true)}
            style={{ padding: '6px 14px', fontSize: '13px' }}
          >
             Переименовать
          </button>

          {/* Скачать */}
          <button
            className="btn btn-primary"
            onClick={handleDownload}
            style={{ padding: '6px 14px', fontSize: '13px' }}
          >
            Скачать
          </button>

          {/* Просмотр в браузере */}
          <button
            className="btn btn-secondary"
            onClick={handleOpenInBrowser}
            style={{ padding: '6px 14px', fontSize: '13px' }}
          >
             Просмотр
          </button>

          {/* Копировать ссылку */}
          <button
            className="btn btn-secondary"
            onClick={handleCopyShareLink}
            style={{ padding: '6px 14px', fontSize: '13px' }}
          >
            Ссылка
          </button>

          {/* Удалить */}
          <button
            className="btn btn-danger"
            onClick={handleDelete}
            style={{ padding: '6px 14px', fontSize: '13px' }}
          >
            Удалить
          </button>

          {/* Комментарий (если нужно добавить) */}
          {showCommentInput ? (
            <div className="flex gap-10" style={{ flex: 1 }}>
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Введите комментарий..."
                style={{
                  flex: 1,
                  background: 'var(--gray)',
                  color: 'white',
                  border: '1px solid var(--gray-light)',
                  borderRadius: '4px',
                  padding: '6px 12px'
                }}
              />
              <button
                className="btn btn-primary"
                onClick={() => {
                  // Здесь будет вызов API для добавления комментария
                  alert('Комментарий добавлен: ' + comment);
                  setShowCommentInput(false);
                }}
                style={{ padding: '6px 14px', fontSize: '13px' }}
              >
                
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setShowCommentInput(false)}
                style={{ padding: '6px 14px', fontSize: '13px' }}
              >
                ✕
              </button>
            </div>
          ) : (
            <button
              className="btn btn-secondary"
              onClick={() => setShowCommentInput(true)}
              style={{ padding: '6px 14px', fontSize: '13px' }}
            >
              Комментарий
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default FileActions;