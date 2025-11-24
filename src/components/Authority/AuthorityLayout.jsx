import React, { useState, useRef, useEffect } from 'react';
import AuthoritySidebar from './AuthoritySidebar';
import './AuthorityLayout.css';
import { FiBell } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const AuthorityLayout = ({ children }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const onDoc = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('click', onDoc);
    return () => document.removeEventListener('click', onDoc);
  }, []);

  const handleLogout = () => {
    try { localStorage.removeItem('token'); localStorage.removeItem('authToken'); } catch (e) {}
    try { sessionStorage.clear(); } catch (e) {}
    navigate('/');
  };

  return (
    <div className="auth-layout">
      <AuthoritySidebar />
      <div className="auth-main">
        <header className="dashboard-header">
          <div className="header-left">
            <div className="brand">Plataforma Ciudadana</div>
          </div>
          <div className="header-center">
            <nav className="top-nav">
              <a href="/base-conocimientos">Base de Conocimientos</a>
            </nav>
          </div>
          <div className="user-section" ref={dropdownRef}>
            <FiBell size={22} className="notification-icon" />
            <div className="header-avatar" onClick={() => setOpen(v => !v)}>LM</div>
            {open && (
              <div className="avatar-dropdown">
                <button className="dropdown-item" onClick={() => { setOpen(false); navigate('/perfil-autoridad'); }}>Perfil</button>
                <button className="dropdown-item" onClick={handleLogout}>Cerrar sesión</button>
              </div>
            )}
          </div>
        </header>
        <main className="dashboard-page-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AuthorityLayout;
