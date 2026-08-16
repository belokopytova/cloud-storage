// pages/Home.jsx
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../App';

const Home = () => {
  const { isAuthenticated, user } = useContext(AppContext);

  return (
    <div className="container">
      <div style={{
        background: 'var(--black)',
        border: '2px solid var(--red)',
        borderRadius: '12px',
        padding: '60px 40px',
        marginTop: '40px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '-50px',
          right: '-50px',
          width: '200px',
          height: '200px',
          background: 'var(--red)',
          opacity: '0.05',
          borderRadius: '50%'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-80px',
          left: '-80px',
          width: '250px',
          height: '250px',
          background: 'var(--red)',
          opacity: '0.05',
          borderRadius: '50%'
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: '72px', marginBottom: '16px' }}></div>
          <h1 style={{
            fontSize: '48px',
            color: 'var(--red)',
            marginBottom: '12px',
            fontWeight: 'bold'
          }}>
            FileHost
          </h1>
          <p style={{
            fontSize: '20px',
            color: 'var(--text-muted)',
            maxWidth: '600px',
            margin: '0 auto 24px',
            lineHeight: '1.6'
          }}>
            Облачное хранилище для ваших файлов.
            Загружайте, делитесь и управляйте файлами в одном месте.
          </p>

          {/* Кнопки действий */}
          <div className="flex gap-10" style={{ justifyContent: 'center', flexWrap: 'wrap' }}>
            {isAuthenticated ? (
              <>
                <Link to="/files" className="btn btn-primary" style={{ fontSize: '16px', padding: '12px 32px' }}>
                  Перейти к файлам
                </Link>
                {user?.is_admin && (
                  <Link to="/admin" className="btn btn-secondary" style={{ fontSize: '16px', padding: '12px 32px' }}>
                    Админ-панель
                  </Link>
                )}
              </>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary" style={{ fontSize: '16px', padding: '12px 32px' }}>
                  Начать
                </Link>
                <Link to="/login" className="btn btn-secondary" style={{ fontSize: '16px', padding: '12px 32px' }}>
                   Войти
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '24px',
        marginTop: '40px'
      }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}></div>
          <h3 style={{ color: 'var(--red)', marginBottom: '8px' }}>Облачное хранилище</h3>
          
        </div>

        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}></div>
          <h3 style={{ color: 'var(--red)', marginBottom: '8px' }}>Безопасность</h3>
        </div>

        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}></div>
          <h3 style={{ color: 'var(--red)', marginBottom: '8px' }}>Простой обмен</h3>
          
        </div>

        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>👥</div>
          <h3 style={{ color: 'var(--red)', marginBottom: '8px' }}>Управление пользователями</h3>
          
        </div>
      </div>

      {/* Информация для авторизованных */}
      {isAuthenticated && (
        <div className="card" style={{ marginTop: '40px', background: 'rgba(204, 0, 0, 0.05)' }}>
          <div className="flex-between" style={{ flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h3 style={{ color: 'var(--red)' }}> Добро пожаловать, {user?.full_name || user?.username}!</h3>
              <p className="text-muted" style={{ marginTop: '4px' }}>
                Вы вошли как {user?.is_admin ? 'администратор' : 'пользователь'}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <span className="text-muted">{user?.email}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;