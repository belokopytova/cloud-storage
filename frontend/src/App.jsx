import React from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import './styles/global.css';

function Home() {
  return (
    <div className="container">
      <div style={{
        background: 'var(--black)',
        border: '2px solid var(--red)',
        borderRadius: '12px',
        padding: '60px 40px',
        marginTop: '40px',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '72px', marginBottom: '16px' }}></div>
        <h1 style={{ color: 'var(--white)', fontSize: '48px', marginBottom: '12px' }}>
          MyCloud
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '20px', maxWidth: '600px', margin: '0 auto 24px' }}>
          Облачное хранилище для ваших файлов
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/files" className="btn btn-primary"> Мои файлы</Link>
          <Link to="/login" className="btn btn-secondary"> Войти</Link>
          <Link to="/register" className="btn btn-secondary"> Регистрация</Link>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginTop: '40px'
      }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '40px' }}></div>
          <h3 style={{ color: 'var(--red)' }}>Облачное хранилище</h3>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '40px' }}></div>
          <h3 style={{ color: 'var(--red)' }}>Безопасность</h3>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '40px' }}></div>
          <h3 style={{ color: 'var(--red)' }}>Простой обмен</h3>
        </div>
      </div>
    </div>
  );
}

function Files() {
  return (
    <div className="container">
      <div className="flex-between mb-20">
        <h1 style={{ color: 'var(--white)' }}>Мои файлы</h1>
        <Link to="/" className="btn btn-secondary"> На главную</Link>
      </div>
      
      <div className="card">
        <h3 className="card-title">Загрузить файл</h3>
        <div style={{
          border: '2px dashed var(--gray-light)',
          borderRadius: '8px',
          padding: '40px 20px',
          textAlign: 'center',
          color: 'var(--text-muted)'
        }}>
          Перетащите файл сюда или нажмите для выбора
        </div>
      </div>

      <div className="card">
        <h3 className="card-title">Список файлов</h3>
        <p className="text-muted">Файлов пока нет. Загрузите первый файл!</p>
      </div>
    </div>
  );
}

function Login() {
  return (
    <div className="container" style={{ maxWidth: '460px', marginTop: '60px' }}>
      <div className="card">
        <h2 className="card-title">Вход</h2>
        <form>
          <div className="form-group">
            <label>Логин</label>
            <input type="text" placeholder="username" />
          </div>
          <div className="form-group">
            <label>Пароль</label>
            <input type="password" placeholder="••••••••" />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
            Войти
          </button>
        </form>
        <div style={{ marginTop: '16px', textAlign: 'center', color: 'var(--text-muted)' }}>
          Нет аккаунта? <Link to="/register" className="text-red">Зарегистрироваться</Link>
        </div>
      </div>
    </div>
  );
}

function Register() {
  return (
    <div className="container" style={{ maxWidth: '460px', marginTop: '60px' }}>
      <div className="card">
        <h2 className="card-title">Регистрация</h2>
        <form>
          <div className="form-group">
            <label>Логин</label>
            <input type="text" placeholder="username" />
          </div>
          <div className="form-group">
            <label>Полное имя</label>
            <input type="text" placeholder="Иван Иванов" />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" placeholder="user@example.com" />
          </div>
          <div className="form-group">
            <label>Пароль</label>
            <input type="password" placeholder="••••••••" />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
            Зарегистрироваться
          </button>
        </form>
        <div style={{ marginTop: '16px', textAlign: 'center', color: 'var(--text-muted)' }}>
          Уже есть аккаунт? <Link to="/login" className="text-red">Войти</Link>
        </div>
      </div>
    </div>
  );
}

function AdminPanel() {
  return (
    <div className="container">
      <div className="flex-between mb-20">
        <h1 style={{ color: 'var(--white)' }}>Админ-панель</h1>
        <Link to="/" className="btn btn-secondary">На главную</Link>
      </div>
      
      <div className="card">
        <h3 className="card-title">Список пользователей</h3>
        <p className="text-muted">Здесь будет список пользователей</p>
      </div>
    </div>
  );
}

function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">MyCloud</Link>
      <div className="navbar-links">
        <Link to="/">Главная</Link>
        <Link to="/files">Файлы</Link>
        <Link to="/admin">Админ</Link>
        <Link to="/login" className="btn btn-primary" style={{ padding: '6px 16px' }}>
          Войти
        </Link>
      </div>
    </nav>
  );
}

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/files" element={<Files />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;