import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Register.css';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';

const Register = () => {
  const [form, setForm] = useState({ email: '', password: '', confirmPassword: '', remember: false });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validaciones básicas de registro
    if (form.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    // Aquí iría la lógica de registro (llamada a API, manejo de respuestas, etc.)
    console.log('Registrando usuario:', { email: form.email });
    // Reset o redirección según la implementación
  };

  return (
    <div className="login-page-container">
      <div className="login-form-box">
        <h2>Crea tu cuenta</h2>
        <p>Únete a nuestra comunidad y ayuda a mejorar tu ciudad.</p>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Correo electrónico</label>
            <input type="email" id="email" name="email" placeholder="juan.perez@example.com" value={form.email} onChange={handleChange} required />
          </div>

          <div className="input-group">
            <label htmlFor="password">Contraseña</label>
            <input type="password" id="password" name="password" value={form.password} onChange={handleChange} required />
          </div>

          <div className="input-group">
            <label htmlFor="confirmPassword">Confirmar contraseña</label>
            <input type="password" id="confirmPassword" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} required />
          </div>

          <div className="form-options">
            <label className="remember-me">
              <input type="checkbox" name="remember" checked={form.remember} onChange={handleChange} /> Recordarme
            </label>
            <div />
          </div>

          {error && <div style={{ color: 'var(--danger-color)', marginBottom: 12 }}>{error}</div>}

          <button type="submit" className="btn-login-submit">Registrarse</button>
        </form>

        <div className="separator">O continuar con</div>
        <div className="social-login-buttons">
          <button className="btn-social google"><FcGoogle size={22} /> Google</button>
          <button className="btn-social facebook"><FaFacebook size={22} color="#1877F2" /> Facebook</button>
        </div>

        <p className="signup-link">¿Ya tienes cuenta? <Link to="/iniciar-sesion">Inicia sesión</Link></p>
      </div>
    </div>
  );
};

export default Register;
