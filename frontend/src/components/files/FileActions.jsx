// components/files/FileActions.jsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { renameFile, deleteFile, addComment } from '../../store/slices/fileSlice';

const FileActions = ({ file, onActionComplete }) => {
  const dispatch = useDispatch();

  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(file.original_name);
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [comment, setComment] = useState(file.comment || '');
  const [showActions, setShowActions] = useState(false);
  const [commentLoading, setCommentLoading] = useState(false);
  const [commentError, setCommentError] = useState(null);
  const [renameLoading, setRenameLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleRename = async () => {
    if (newName.trim() && newName !== file.original_name) {
      setRenameLoading(true);
      try {
        const result = await dispatch(renameFile({ id: file.id, newName }));

        if (renameFile.fulfilled.match(result)) {
          alert('Файл успешно переименован!');
          setIsEditing(false);
          if (onActionComplete) onActionComplete();
        } else {
          alert('Ошибка при переименовании файла');
        }
      } catch (err) {
        alert('Ошибка при переименовании файла');
        console.error('Rename error:', err);
      } finally {
        setRenameLoading(false);
      }
    } else {
      setIsEditing(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Удалить файл "${file.original_name}"?`)) {
      setDeleteLoading(true);
      try {
        const result = await dispatch(deleteFile(file.id));

        if (deleteFile.fulfilled.match(result)) {
          alert('Файл успешно удален!');
          if (onActionComplete) onActionComplete();
        } else {
          alert('Ошибка при удалении файла');
        }
      } catch (err) {
        alert('Ошибка при удалении файла');
        console.error('Delete error:', err);
      } finally {
        setDeleteLoading(false);
      }
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = `${import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'}/files/${file.id}/download/`;
    link.setAttribute('download', file.original_name);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleCopyShareLink = async () => {
    try {
      const shareLink = `${window.location.origin}/share/${file.id}`;
      await navigator.clipboard.writeText(shareLink);
      // Можно добавить toast notification вместо alert
      alert('Ссылка скопирована в буфер обмена!');
    } catch (err) {
      alert('Ошибка при копировании ссылки');
    }
  };

  const handleAddComment = async () => {
    if (!comment.trim()) {
      setCommentError('Комментарий не может быть пустым');
      return;
    }

    setCommentLoading(true);
    setCommentError(null);

    try {
      const result = await dispatch(addComment({ id: file.id, comment }));

      if (addComment.fulfilled.match(result)) {
        // Комментарий успешно добавлен
        alert('Комментарий успешно обновлен!');
        setShowCommentInput(false);
        setComment('');
      } else if (addComment.rejected.match(result)) {
        // Ошибка при добавлении комментария
        setCommentError('Ошибка при обновлении комментария');
      }
    } catch (error) {
      setCommentError('Неожиданная ошибка при обновлении комментария');
      console.error('Ошибка:', error);
    } finally {
      setCommentLoading(false);
    }
  };

  const handleOpenInBrowser = () => {
    window.open(
      `${import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'}/files/${file.id}/download/`,
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
              <button className="btn btn-primary" onClick={handleRename} disabled={renameLoading} style={{ padding: '4px 12px' }}>
                {renameLoading ? '' : ''}
              </button>
              <button className="btn btn-secondary" onClick={() => setIsEditing(false)} style={{ padding: '4px 12px' }}>
                ✕
              </button>
            </div>
          ) : (
            <div>
              <div style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--text)' }}>
                {file.original_name}
              </div>
              <div className="text-muted" style={{ fontSize: '13px', marginTop: '4px' }}>
                <span>{formatSize(file.size)}</span>
                <span style={{ margin: '0 8px' }}>•</span>
                <span>{formatDate(file.upload_date)}</span>
                {file.last_download_date && (
                  <>
                    <span style={{ margin: '0 8px' }}>•</span>
                    <span>{formatDate(file.last_download_date)}</span>
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
            disabled={renameLoading || deleteLoading}
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
            disabled={deleteLoading || renameLoading}
            style={{ padding: '6px 14px', fontSize: '13px', opacity: deleteLoading ? 0.6 : 1 }}
          >
            {deleteLoading ? '' : ''} Удалить
          </button>

          {/* Комментарий (если нужно добавить) */}
          {showCommentInput ? (
            <div className="flex gap-10" style={{ flex: 1 }}>
              <input
                type="text"
                value={comment}
                onChange={(e) => {
                  setComment(e.target.value);
                  setCommentError(null);
                }}
                placeholder="Введите комментарий"
                disabled={commentLoading}
                style={{
                  flex: 1,
                  background: 'var(--gray)',
                  color: 'white',
                  border: commentError ? '1px solid var(--red)' : '1px solid var(--gray-light)',
                  borderRadius: '4px',
                  padding: '6px 12px'
                }}
              />
              <button
                className="btn btn-primary"
                onClick={handleAddComment}
                disabled={commentLoading}
                style={{ padding: '6px 14px', fontSize: '13px' }}
              >
                {commentLoading ? '' : '✓'}
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setShowCommentInput(false);
                  setComment(file.comment || '');
                  setCommentError(null);
                }}
                disabled={commentLoading}
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
          {commentError && (
            <div
              style={{
                color: 'var(--red)',
                fontSize: '12px',
                marginTop: '4px',
                flex: '100%',
              }}
            >
              {commentError}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FileActions;
