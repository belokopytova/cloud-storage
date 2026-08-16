import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { login, clearError } from '../../store/slices/authSlice';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    username: '',
    password: '',
  });
  const [localError, setLocalError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(clearError());
    setLocalError('');

    if (!form.username || !form.password) {
      setLocalError('Заполните все поля');
      return;
    }

    dispatch(login(form)).then((action) => {
      if (action.type === 'auth/login/fulfilled') {
        navigate('/files');
      }
    });
  };

  return (
    <div className="container" style={{ maxWidth: '460px', marginTop: '60px' }}>
      <div className="card">
        <h2 className="card-title">Вход</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Логин</label>
            <input
              type="text"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              placeholder="username"
            />
          </div>

          <div className="form-group">
            <label>Пароль</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
            />
          </div>

          {(localError || error) && (
            <div className="error" style={{ marginBottom: '12px' }}>
              {localError || (typeof error === 'string' ? error : 'Неверный логин или пароль')}
            </div>
          )}

          <button type="submit" className="btn btn-primary" disabled={isLoading} style={{ width: '100%' }}>
            {isLoading ? 'Вход...' : 'Войти'}
          </button>
        </form>
        <div style={{ marginTop: '16px', textAlign: 'center', color: 'var(--text-muted)' }}>
          Нет аккаунта? <Link to="/register" className="text-red">Зарегистрироваться</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;