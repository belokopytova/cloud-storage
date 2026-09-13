import React from 'react';
import { useSelector } from 'react-redux';
import FileUpload from '../components/files/FileUpload';
import FileList from '../components/files/FileList';

const FileManager = () => {
  const { user } = useSelector((state) => state.auth);
  const { files } = useSelector((state) => state.files);

  return (
    <div className="container">
      <div className="flex-between mb-20">
        <div>
          <h1 style={{ color: 'var(--red)', marginBottom: '4px' }}>Управление файлами</h1>
          <div className="text-muted">Добро пожаловать, {user?.full_name || user?.username}!</div>
        </div>
        <div style={{ background: 'var(--gray)', padding: '8px 16px', borderRadius: '4px', fontSize: '14px' }}>
          <span className="text-muted">Всего файлов: </span>
          <span style={{ color: 'var(--red)', fontWeight: 'bold' }}>{files.length}</span>
        </div>
      </div>

      <FileUpload />
      <FileList />
    </div>
  );
};

export default FileManager;