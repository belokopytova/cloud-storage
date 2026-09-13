import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register, clearError } from '../store/slices/authSlice';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    full_name: '',
    password: '',
    password2: '',
  });

  const [validationError, setValidationError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  
    if (error) {
      dispatch(clearError());
    }
    setValidationError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.password2) {
      setValidationError('Пароли не совпадают');
      return;
    }

    if (formData.password.length < 6) {
      setValidationError('Пароль должен быть не менее 6 символов');
      return;
    }

    try {
      const result = await dispatch(
        register({
          username: formData.username,
          email: formData.email,
          full_name: formData.full_name,
          password: formData.password,
        })
      );

      if (register.fulfilled.match(result)) {
        navigate('/files');
      }
    } catch (err) {
      console.error('Register error:', err);
    }
  };

  const getErrorMessage = () => {
    if (validationError) return validationError;
    if (!error) return null;

    if (typeof error === 'string') return error;
    if (error.username) return error.username[0];
    if (error.email) return error.email[0];
    if (error.password) return error.password[0];
    if (error.detail) return error.detail;
    if (error.non_field_errors) return error.non_field_errors[0];

    return 'Ошибка при регистрации. Проверьте данные.';
  };

  const hasError = error || validationError;

  return (
    <div className="container" style={{ maxWidth: '460px', marginTop: '40px', marginBottom: '40px' }}>
      <div className="card">
        <h2 className="card-title">Регистрация</h2>

        {hasError && (
          <div
            style={{
              background: 'rgba(255, 0, 0, 0.1)',
              border: '1px solid var(--red)',
              borderRadius: '4px',
              padding: '12px',
              marginBottom: '16px',
              color: 'var(--red)',
              fontSize: '14px',
            }}
          >
            {getErrorMessage()}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Логин</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="username"
              disabled={isLoading}
              style={{
                background: 'var(--gray)',
                color: 'white',
                border: hasError ? '1px solid var(--red)' : '1px solid var(--gray-light)',
                borderRadius: '4px',
                padding: '8px 12px',
                fontSize: '14px',
                opacity: isLoading ? 0.6 : 1,
              }}
              required
            />
          </div>

          <div className="form-group">
            <label>Полное имя</label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              placeholder="Иван Иванов"
              disabled={isLoading}
              style={{
                background: 'var(--gray)',
                color: 'white',
                border: hasError ? '1px solid var(--red)' : '1px solid var(--gray-light)',
                borderRadius: '4px',
                padding: '8px 12px',
                fontSize: '14px',
                opacity: isLoading ? 0.6 : 1,
              }}
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="user@example.com"
              disabled={isLoading}
              style={{
                background: 'var(--gray)',
                color: 'white',
                border: hasError ? '1px solid var(--red)' : '1px solid var(--gray-light)',
                borderRadius: '4px',
                padding: '8px 12px',
                fontSize: '14px',
                opacity: isLoading ? 0.6 : 1,
              }}
              required
            />
          </div>

          <div className="form-group">
            <label>Пароль</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              disabled={isLoading}
              style={{
                background: 'var(--gray)',
                color: 'white',
                border: hasError ? '1px solid var(--red)' : '1px solid var(--gray-light)',
                borderRadius: '4px',
                padding: '8px 12px',
                fontSize: '14px',
                opacity: isLoading ? 0.6 : 1,
              }}
              required
            />
          </div>

          <div className="form-group">
            <label>Повторите пароль</label>
            <input
              type="password"
              name="password2"
              value={formData.password2}
              onChange={handleChange}
              placeholder="••••••••"
              disabled={isLoading}
              style={{
                background: 'var(--gray)',
                color: 'white',
                border: hasError ? '1px solid var(--red)' : '1px solid var(--gray-light)',
                borderRadius: '4px',
                padding: '8px 12px',
                fontSize: '14px',
                opacity: isLoading ? 0.6 : 1,
              }}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading}
            style={{
              width: '100%',
              opacity: isLoading ? 0.6 : 1,
              cursor: isLoading ? 'not-allowed' : 'pointer',
            }}
          >
            {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
          </button>
        </form>

        <div
          style={{
            marginTop: '16px',
            textAlign: 'center',
            color: 'var(--text-muted)',
          }}
        >
          Уже есть аккаунт?{' '}
          <Link to="/login" className="text-red" style={{ textDecoration: 'underline' }}>
            Войти
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
