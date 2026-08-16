import React, { useContext, useState } from 'react';
import { AppContext } from '../../App';
import FileActions from './FileActions';

const FileList = () => {
  const { files, loading, fetchFiles } = useContext(AppContext);
  const [filter, setFilter] = useState('');
  const [sortBy, setSortBy] = useState('uploaded_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const filteredFiles = files?.filter(file => 
    file.name.toLowerCase().includes(filter.toLowerCase()) ||
    (file.comment && file.comment.toLowerCase().includes(filter.toLowerCase()))
  );

  const sortedFiles = filteredFiles?.sort((a, b) => {
    let comparison = 0;
    if (sortBy === 'name') {
      comparison = a.name.localeCompare(b.name);
    } else if (sortBy === 'size') {
      comparison = a.size - b.size;
    } else if (sortBy === 'uploaded_at') {
      comparison = new Date(a.uploaded_at) - new Date(b.uploaded_at);
    }
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  if (loading) {
    return (
      <div className="card">
        <div className="text-muted" style={{ textAlign: 'center', padding: '40px 0' }}>
          Загрузка файлов...
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex-between">
        <h3 className="card-title">Мои файлы ({sortedFiles?.length || 0})</h3>
        
        {/* Поиск и фильтрация */}
        <div className="flex gap-10">
          <input
            type="text"
            placeholder="Поиск..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{
              background: 'var(--gray)',
              color: 'white',
              border: '1px solid var(--gray-light)',
              borderRadius: '4px',
              padding: '6px 12px',
              fontSize: '13px'
            }}
          />
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              background: 'var(--gray)',
              color: 'white',
              border: '1px solid var(--gray-light)',
              borderRadius: '4px',
              padding: '6px 12px',
              fontSize: '13px'
            }}
          >
            <option value="uploaded_at">По дате</option>
            <option value="name">По имени</option>
            <option value="size">По размеру</option>
          </select>
          
          <button
            className="btn btn-secondary"
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            style={{ padding: '6px 12px', fontSize: '13px' }}
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>
      </div>

      {sortedFiles?.length === 0 ? (
        <div className="text-muted" style={{ textAlign: 'center', padding: '40px 0' }}>
          {filter ? 'Ничего не найдено' : 'Файлов пока нет. Загрузите первый файл!'}
        </div>
      ) : (
        <div>
          {sortedFiles?.map((file) => (
            <FileActions 
              key={file.id} 
              file={file} 
              onActionComplete={() => {
                fetchFiles();
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FileList;