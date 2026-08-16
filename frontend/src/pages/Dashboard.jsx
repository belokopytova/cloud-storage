// pages/Dashboard.jsx
import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../App';
import { filesAPI } from '../api/api';

const Dashboard = () => {
  const { user, files } = useContext(AppContext);
  const [stats, setStats] = useState({
    totalFiles: 0,
    totalSize: 0,
    lastUpload: null,
    mostDownloaded: null,
  });

  useEffect(() => {
    if (files && files.length > 0) {
      // Общая статистика
      const totalSize = files.reduce((sum, f) => sum + (f.size || 0), 0);
      const lastUpload = files.length > 0 ? files[0] : null;
      
      const mostDownloaded = files.length > 0 
        ? files.reduce((prev, current) => 
            (prev.download_count || 0) > (current.download_count || 0) ? prev : current
          )
        : null;

      setStats({
        totalFiles: files.length,
        totalSize,
        lastUpload,
        mostDownloaded,
      });
    }
  }, [files]);

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
    <div className="container">
      <div style={{ marginTop: '20px' }}>
        <div className="flex-between mb-20">
          <h1 style={{ color: 'var(--red)' }}> Панель управления</h1>
          <Link to="/files" className="btn btn-primary">
            Управлять файлами
          </Link>
        </div>

        {/* Статистические карточки */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginBottom: '24px'
        }}>
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '32px', marginBottom: '4px' }}></div>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--red)' }}>
              {stats.totalFiles}
            </div>
            <div className="text-muted">Всего файлов</div>
          </div>

          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '32px', marginBottom: '4px' }}></div>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--red)' }}>
              {formatSize(stats.totalSize)}
            </div>
            <div className="text-muted">Общий размер</div>
          </div>

          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '32px', marginBottom: '4px' }}>👤</div>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--red)' }}>
              {user?.username}
            </div>
            <div className="text-muted">
              {user?.is_admin ? 'Администратор' : 'Пользователь'}
            </div>
          </div>
        </div>

        {/* Информация о последних файлах */}
        <div className="card">
          <h3 className="card-title">Последние файлы</h3>
          
          {files && files.length > 0 ? (
            <div>
              {files.slice(0, 5).map((file) => (
                <div key={file.id} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 0',
                  borderBottom: '1px solid var(--gray)',
                  flexWrap: 'wrap',
                  gap: '8px'
                }}>
                  <div>
                    <div style={{ fontWeight: 'bold' }}> {file.name}</div>
                    <div className="text-muted" style={{ fontSize: '13px' }}>
                      {formatSize(file.size)} • {formatDate(file.uploaded_at)}
                    </div>
                  </div>
                  <Link 
                    to={`/files`} 
                    className="btn btn-secondary" 
                    style={{ padding: '4px 12px', fontSize: '12px' }}
                  >
                    Подробнее
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-muted" style={{ textAlign: 'center', padding: '20px 0' }}>
              Файлов пока нет. <Link to="/files" className="text-red">Загрузите первый файл!</Link>
            </div>
          )}
        </div>

        {/* Информация о пользователе */}
        {user && (
          <div className="card">
            <h3 className="card-title">👤 Информация профиля</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <div className="text-muted" style={{ fontSize: '12px' }}>Логин</div>
                <div style={{ fontWeight: 'bold' }}>{user.username}</div>
              </div>
              <div>
                <div className="text-muted" style={{ fontSize: '12px' }}>Полное имя</div>
                <div style={{ fontWeight: 'bold' }}>{user.full_name || '—'}</div>
              </div>
              <div>
                <div className="text-muted" style={{ fontSize: '12px' }}>Email</div>
                <div style={{ fontWeight: 'bold' }}>{user.email}</div>
              </div>
              <div>
                <div className="text-muted" style={{ fontSize: '12px' }}>Роль</div>
                <div style={{ fontWeight: 'bold', color: user.is_admin ? 'var(--red)' : 'var(--text-muted)' }}>
                  {user.is_admin ? 'Администратор' : 'Пользователь'}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;