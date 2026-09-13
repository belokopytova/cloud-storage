import React, { useState, useEffect } from 'react';                   
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';                    
import { fetchFiles } from '../../store/slices/fileSlice';
import FileActions from './FileActions';

const FileList = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();                          
  const userId = searchParams.get('user');                         

  const { files, isLoading } = useSelector((state) => state.files);
  const [filter, setFilter] = useState('');
  const [sortBy, setSortBy] = useState('upload_date');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    dispatch(fetchFiles(userId));
  }, [dispatch, userId]);

  const filteredFiles = files?.filter(
    (file) =>
      file.original_name?.toLowerCase().includes(filter.toLowerCase()) ||
      (file.comment && file.comment?.toLowerCase().includes(filter.toLowerCase()))
  );

  const sortedFiles = filteredFiles?.sort((a, b) => {
    let comparison = 0;
    if (sortBy === 'original_name') {
      comparison = a.original_name.localeCompare(b.original_name);
    } else if (sortBy === 'size') {
      comparison = a.size - b.size;
    } else if (sortBy === 'upload_date') {
      comparison = new Date(a.upload_date) - new Date(b.upload_date);
    }
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  if (isLoading) {
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
        <h3 className="card-title">
          {userId ? `Файлы пользователя ${userId}` : 'Мои файлы'} ({sortedFiles?.length || 0})
        </h3>


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
              fontSize: '13px',
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
              fontSize: '13px',
            }}
          >
            <option value="upload_date">По дате</option>
            <option value="original_name">По имени</option>
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
                dispatch(fetchFiles(userId));                       
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FileList;