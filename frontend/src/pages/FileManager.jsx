// pages/FileManager.jsx
import React, { useContext } from 'react';
import { AppContext } from '../App';
import FileUpload from '../components/files/FileUpload';
import FileList from '../components/files/FileList';

const FileManager = () => {
  const { user, loading } = useContext(AppContext);

  if (loading) {
    return (
      <div className="container">
        <div className="text-muted" style={{ textAlign: 'center', padding: '60px 0' }}>
          Загрузка...
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="flex-between mb-20">
        <div>
          <h1 style={{ color: 'var(--red)', marginBottom: '4px' }}> Управление файлами</h1>
          <div className="text-muted">Добро пожаловать, {user?.full_name || user?.username}!</div>
        </div>
        <div style={{ 
          background: 'var(--gray)',
          padding: '8px 16px',
          borderRadius: '4px',
          fontSize: '14px'
        }}>
          <span className="text-muted">Всего файлов: </span>
          <span style={{ color: 'var(--red)', fontWeight: 'bold' }}>
            {user?.files_count || 0}
          </span>
        </div>
      </div>

      <FileUpload />
      <FileList />
    </div>
  );
};

export default FileManager;