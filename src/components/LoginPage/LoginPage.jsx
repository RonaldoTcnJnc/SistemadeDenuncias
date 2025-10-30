import React from 'react';
import { Link } from 'react-router-dom';
import './LoginPage.css';
// Importa íconos
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';

const LoginPage = () => {
  return (
    <div className="login-page-container">
      <div className="login-form-box">
        <h2>Bienvenido de vuelta</h2>
        <p>Inicia sesión para continuar en la plataforma.</p>
        <form>
          <div className="input-group">
            <label htmlFor="email">Correo electrónico</label>
            <input type="email" id="email" placeholder="juan.perez@example.com" />
          </div>
          <div className="input-group">
            <label htmlFor="password">Contraseña</label>
            <input type="password" id="password" />
          </div>
          <div className="form-options">
            <label className="remember-me">
              <input type="checkbox" /> Recordarme
            </label>
            <a href="#">¿Olvidaste tu contraseña?</a>
          </div>
          <button type="submit" className="btn-login-submit">Iniciar Sesión</button>
        </form>
        <div className="separator">O continuar con</div>
        <div className="social-login-buttons">
          <button className="btn-social google">
            <FcGoogle size={22} /> Google
          </button>
          <button className="btn-social facebook">
            <FaFacebook size={22} color="#1877F2"/> Facebook
          </button>
        </div>
        <p className="signup-link">
          ¿No tienes una cuenta? <Link to="/registro">Crear cuenta</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;