// pages/AdminPanel.jsx
import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../App';
import { usersAPI } from '../api/api';

const AdminPanel = () => {
  const { user, users, loading, fetchUsers, handleDeleteUser, handleToggleAdmin } = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserDetails, setShowUserDetails] = useState(false);

  // Фильтрация пользователей
  const filteredUsers = users?.filter(u => 
    u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.full_name && u.full_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (date) => {
    return date ? new Date(date).toLocaleString('ru-RU') : '—';
  };

  // Статистика
  const stats = {
    total: users?.length || 0,
    admins: users?.filter(u => u.is_admin).length || 0,
    users: users?.filter(u => !u.is_admin).length || 0,
  };

  return (
    <div className="container">
      <div style={{ marginTop: '20px' }}>
        <div className="flex-between mb-20" style={{ flexWrap: 'wrap', gap: '12px' }}>
          <h1 style={{ color: 'var(--red)' }}>Админ-панель</h1>
          <div className="flex gap-10">
            <Link to="/dashboard" className="btn btn-secondary">
              Дашборд
            </Link>
            <Link to="/files" className="btn btn-primary">
              Файлы
            </Link>
          </div>
        </div>

        {/* Статистика */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '16px',
          marginBottom: '24px'
        }}>
          <div className="card" style={{ textAlign: 'center', padding: '16px' }}>
            <div style={{ fontSize: '24px', color: 'var(--red)' }}>{stats.total}</div>
            <div className="text-muted" style={{ fontSize: '14px' }}>Всего пользователей</div>
          </div>
          <div className="card" style={{ textAlign: 'center', padding: '16px' }}>
            <div style={{ fontSize: '24px', color: 'var(--red)' }}>{stats.admins}</div>
            <div className="text-muted" style={{ fontSize: '14px' }}>Администраторов</div>
          </div>
          <div className="card" style={{ textAlign: 'center', padding: '16px' }}>
            <div style={{ fontSize: '24px', color: 'var(--red)' }}>{stats.users}</div>
            <div className="text-muted" style={{ fontSize: '14px' }}>Пользователей</div>
          </div>
        </div>

        {/* Поиск */}
        <div className="card">
          <div className="flex-between" style={{ flexWrap: 'wrap', gap: '12px' }}>
            <h3 className="card-title" style={{ marginBottom: '0' }}>Список пользователей</h3>
            <input
              type="text"
              placeholder="Поиск пользователей..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                background: 'var(--gray)',
                color: 'white',
                border: '1px solid var(--gray-light)',
                borderRadius: '4px',
                padding: '8px 16px',
                minWidth: '200px'
              }}
            />
          </div>

          {loading ? (
            <div className="text-muted" style={{ textAlign: 'center', padding: '40px 0' }}>
              Загрузка...
            </div>
          ) : filteredUsers?.length === 0 ? (
            <div className="text-muted" style={{ textAlign: 'center', padding: '40px 0' }}>
              {searchTerm ? 'Пользователи не найдены' : 'Пользователей пока нет'}
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Логин</th>
                    <th>Полное имя</th>
                    <th>Email</th>
                    <th>Роль</th>
                    <th>Файлы</th>
                    <th>Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers?.map((u) => (
                    <tr key={u.id}>
                      <td>
                        <strong>{u.username}</strong>
                        {u.id === user?.id && (
                          <span style={{ 
                            color: 'var(--red)', 
                            fontSize: '12px', 
                            marginLeft: '8px',
                            fontWeight: 'bold'
                          }}>
                            (Вы)
                          </span>
                        )}
                      </td>
                      <td>{u.full_name || '—'}</td>
                      <td>{u.email}</td>
                      <td>
                        <button
                          className={`btn ${u.is_admin ? 'btn-primary' : 'btn-secondary'}`}
                          style={{ padding: '4px 12px', fontSize: '12px' }}
                          onClick={() => handleToggleAdmin(u.id, u.is_admin)}
                          disabled={u.id === user?.id} 
                          title={u.id === user?.id ? 'Нельзя изменить свои права' : ''}
                        >
                          {u.is_admin ? 'Админ' : 'Пользователь'}
                        </button>
                      </td>
                      <td>
                        <div className="text-muted" style={{ fontSize: '13px' }}>
                          {u.files_count || 0} файлов
                        </div>
                      </td>
                      <td>
                        <div className="flex gap-10" style={{ flexWrap: 'wrap' }}>
                          <button
                            className="btn btn-secondary"
                            style={{ padding: '4px 10px', fontSize: '12px' }}
                            onClick={() => {
                              setSelectedUser(u);
                              setShowUserDetails(true);
                            }}
                          >
                            Инфо
                          </button>
                          <Link
                            to={`/files?user=${u.id}`}
                            className="btn btn-secondary"
                            style={{ padding: '4px 10px', fontSize: '12px', textDecoration: 'none' }}
                          >
                            Файлы
                          </Link>
                          <button
                            className="btn btn-danger"
                            style={{ padding: '4px 10px', fontSize: '12px' }}
                            onClick={() => handleDeleteUser(u.id)}
                            disabled={u.id === user?.id}
                            title={u.id === user?.id ? 'Нельзя удалить себя' : ''}
                          >
                            
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Модальное окно с деталями пользователя */}
        {showUserDetails && selectedUser && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }} onClick={() => setShowUserDetails(false)}>
            <div className="card" style={{ 
              maxWidth: '500px', 
              width: '100%',
              maxHeight: '80vh',
              overflow: 'auto'
            }} onClick={(e) => e.stopPropagation()}>
              <div className="flex-between">
                <h3 className="card-title" style={{ marginBottom: '0' }}>👤 Детали пользователя</h3>
                <button 
                  className="btn btn-secondary" 
                  onClick={() => setShowUserDetails(false)}
                  style={{ padding: '4px 12px' }}
                >
                  ✕
                </button>
              </div>
              
              <div style={{ marginTop: '16px' }}>
                <div style={{ marginBottom: '12px' }}>
                  <div className="text-muted" style={{ fontSize: '12px' }}>Логин</div>
                  <div style={{ fontWeight: 'bold', fontSize: '18px' }}>{selectedUser.username}</div>
                </div>
                <div style={{ marginBottom: '12px' }}>
                  <div className="text-muted" style={{ fontSize: '12px' }}>Полное имя</div>
                  <div>{selectedUser.full_name || '—'}</div>
                </div>
                <div style={{ marginBottom: '12px' }}>
                  <div className="text-muted" style={{ fontSize: '12px' }}>Email</div>
                  <div>{selectedUser.email}</div>
                </div>
                <div style={{ marginBottom: '12px' }}>
                  <div className="text-muted" style={{ fontSize: '12px' }}>Роль</div>
                  <div style={{ color: selectedUser.is_admin ? 'var(--red)' : 'var(--text-muted)' }}>
                    {selectedUser.is_admin ? 'Администратор' : ' Пользователь'}
                  </div>
                </div>
                <div style={{ marginBottom: '12px' }}>
                  <div className="text-muted" style={{ fontSize: '12px' }}>Количество файлов</div>
                  <div>{selectedUser.files_count || 0}</div>
                </div>
                <div style={{ marginBottom: '12px' }}>
                  <div className="text-muted" style={{ fontSize: '12px' }}>Дата регистрации</div>
                  <div>{formatDate(selectedUser.date_joined)}</div>
                </div>
                <div style={{ marginBottom: '12px' }}>
                  <div className="text-muted" style={{ fontSize: '12px' }}>Последний вход</div>
                  <div>{formatDate(selectedUser.last_login)}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;