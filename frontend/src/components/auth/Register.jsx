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
  const [serverErrors, setServerErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    
    // Логин: латиница, цифры, первый символ буква, 4-20 символов
    if (!/^[A-Za-z][A-Za-z0-9]{3,19}$/.test(form.username)) {
      newErrors.username =
        'Логин должен начинаться с буквы, содержать только латиницу и цифры, длина 4-20 символов';
    }
    
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Введите корректный email';
    }
    
    // Пароль: минимум 8 символов 
    if (form.password.length < 8) {
      newErrors.password = 'Пароль должен быть не менее 8 символов';
    } else if (!/[A-Z]/.test(form.password)) {
      newErrors.password = 'Пароль должен содержать хотя бы одну заглавную букву';
    } else if (!/\d/.test(form.password)) {
      newErrors.password = 'Пароль должен содержать хотя бы одну цифру';
    }
    
    if (!form.full_name.trim()) {
      newErrors.full_name = 'Полное имя обязательно';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());
    setServerErrors({});
    
    if (!validate()) return;

    try {
      const result = await dispatch(register(form)).unwrap();
      navigate('/login');
    } catch (error) {
      console.error('Ошибка регистрации:', error);
      
      if (error && typeof error === 'object') {
        
        const fieldErrors = {};
        if (error.username) fieldErrors.username = error.username[0];
        if (error.email) fieldErrors.email = error.email[0];
        if (error.password) fieldErrors.password = error.password[0];
        if (error.full_name) fieldErrors.full_name = error.full_name[0];
        
        setServerErrors(fieldErrors);
        
    
        if (error.non_field_errors) {
          setErrors(prev => ({ ...prev, general: error.non_field_errors[0] }));
        }
      }
    }
  };

  return (
    <div className="container" style={{ maxWidth: '460px', marginTop: '60px' }}>
      <div className="card">
        <h2 className="card-title">Регистрация</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Логин *</label>
            <input
              type="text"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              placeholder="username"
              className={errors.username || serverErrors.username ? 'error-input' : ''}
            />
            {(errors.username || serverErrors.username) && (
              <div className="error">{errors.username || serverErrors.username}</div>
            )}
          </div>

          <div className="form-group">
            <label>Полное имя *</label>
            <input
              type="text"
              value={form.full_name}
              onChange={(e) => setForm({ ...form, full_name: e.target.value })}
              placeholder="Иван Иванов"
              className={errors.full_name || serverErrors.full_name ? 'error-input' : ''}
            />
            {(errors.full_name || serverErrors.full_name) && (
              <div className="error">{errors.full_name || serverErrors.full_name}</div>
            )}
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="user@example.com"
              className={serverErrors.email ? 'error-input' : ''}
            />
            {(errors.email || serverErrors.email) && (
              <div className="error">{errors.email || serverErrors.email}</div>
            )}
          </div>

          <div className="form-group">
            <label>Пароль *</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="минимум 8 символов"
              className={errors.password || serverErrors.password ? 'error-input' : ''}
            />
            {(errors.password || serverErrors.password) && (
              <div className="error">{errors.password || serverErrors.password}</div>
            )}
            <small style={{ color: 'var(--text-muted)', display: 'block', marginTop: '4px' }}>
              Пароль: минимум 8 символов, заглавная буква и цифра
            </small>
          </div>

          {error && typeof error === 'string' && (
            <div className="error" style={{ marginBottom: '12px' }}>
              {error}
            </div>
          )}

          {errors.general && (
            <div className="error" style={{ marginBottom: '12px' }}>
              {errors.general}
            </div>
          )}

          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={isLoading} 
            style={{ width: '100%' }}
          >
            {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
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