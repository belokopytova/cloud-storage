import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        FileHost
      </Link>
      <div className="navbar-links">
        {isAuthenticated ? (
          <>
            <span className="text-muted" style={{ fontSize: '14px' }}>
              {user?.username}
            </span>
            {user?.is_admin && (
              <Link to="/admin">Админ</Link>
            )}
            <Link to="/files">Мои файлы</Link>
            <button onClick={handleLogout}>Выйти</button>
          </>
        ) : (
          <>
            <Link to="/login">Вход</Link>
            <Link to="/register">Регистрация</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;