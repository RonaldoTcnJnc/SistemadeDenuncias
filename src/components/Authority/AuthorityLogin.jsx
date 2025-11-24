import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AuthorityLogin.css';

const AuthorityLogin = () => {
  const navigate = useNavigate();

  return (
    <div className="auth-login-wrapper">
      <div className="auth-login-card">
        <h2>Iniciar sesión - Autoridad</h2>
        <div className="auth-form">
          <label>
            Usuario
            <input type="text" name="username" placeholder="usuario@institucion.gov" />
          </label>
          <label>
            Contraseña
            <input type="password" name="password" placeholder="********" />
          </label>
          <button type="button" onClick={() => navigate('/panel-autoridad')} className="btn btn-primary">Ingresar</button>
        </div>
      </div>
    </div>
  );
};

export default AuthorityLogin;
