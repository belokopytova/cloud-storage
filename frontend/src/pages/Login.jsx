import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearError } from '../store/slices/authSlice';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) {
      dispatch(clearError());
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await dispatch(login(formData));

      if (login.fulfilled.match(result)) {

        navigate('/files');
      }
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  const getErrorMessage = () => {
    if (!error) return null;

    if (typeof error === 'string') return error;
    if (error.username) return error.username[0];
    if (error.password) return error.password[0];
    if (error.detail) return error.detail;
    if (error.non_field_errors) return error.non_field_errors[0];

    return 'Ошибка при входе. Проверьте данные.';
  };

  return (
    <div className="container" style={{ maxWidth: '460px', marginTop: '60px' }}>
      <div className="card">
        <h2 className="card-title">Вход</h2>

        {error && (
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
                border: error ? '1px solid var(--red)' : '1px solid var(--gray-light)',
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
                border: error ? '1px solid var(--red)' : '1px solid var(--gray-light)',
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
            {isLoading ? '⏳ Вход...' : 'Войти'}
          </button>
        </form>

        <div
          style={{
            marginTop: '16px',
            textAlign: 'center',
            color: 'var(--text-muted)',
          }}
        >
          Нет аккаунта?{' '}
          <Link to="/register" className="text-red" style={{ textDecoration: 'underline' }}>
            Зарегистрироваться
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
