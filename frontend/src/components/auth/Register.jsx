import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { register, clearError } from '../../store/slices/authSlice';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    username: '',
    full_name: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    // Логин: латиница, цифры, первый символ буква, 4-20 символов
    if (!/^[A-Za-z][A-Za-z0-9]{3,19}$/.test(form.username)) {
      newErrors.username =
        'Логин должен начинаться с буквы, содержать только латиницу и цифры, длина 4-20 символов';
    }
    // Email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Введите корректный email';
    }
    // Пароль: минимум 6 символов, заглавная, цифра, спецсимвол
    if (!/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};:'",.<>/?]).{6,}$/.test(form.password)) {
      newErrors.password =
        'Пароль: минимум 6 символов, одна заглавная буква, одна цифра, один спецсимвол';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(clearError());
    if (!validate()) return;

    dispatch(register(form)).then((action) => {
      if (action.type === 'auth/register/fulfilled') {
        navigate('/files');
      }
    });
  };

  return (
    <div className="container" style={{ maxWidth: '460px', marginTop: '60px' }}>
      <div className="card">
        <h2 className="card-title">Регистрация</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Логин</label>
            <input
              type="text"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              placeholder="username"
            />
            {errors.username && <div className="error">{errors.username}</div>}
          </div>

          <div className="form-group">
            <label>Полное имя</label>
            <input
              type="text"
              value={form.full_name}
              onChange={(e) => setForm({ ...form, full_name: e.target.value })}
              placeholder="Иван Иванов"
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="user@example.com"
            />
            {errors.email && <div className="error">{errors.email}</div>}
          </div>

          <div className="form-group">
            <label>Пароль</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
            />
            {errors.password && <div className="error">{errors.password}</div>}
          </div>

          {error && (
            <div className="error" style={{ marginBottom: '12px' }}>
              {typeof error === 'string' ? error : JSON.stringify(error)}
            </div>
          )}

          <button type="submit" className="btn btn-primary" disabled={isLoading} style={{ width: '100%' }}>
            {isLoading ? 'Загрузка...' : 'Зарегистрироваться'}
          </button>
        </form>
        <div style={{ marginTop: '16px', textAlign: 'center', color: 'var(--text-muted)' }}>
          Уже есть аккаунт? <Link to="/login" className="text-red">Войти</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;