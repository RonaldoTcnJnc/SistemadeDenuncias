import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './LoginPage.css';

const LoginPage = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, type: 'ciudadano' })
      });

      // Verificar si la respuesta es OK antes de parsear JSON
      if (!response.ok) {
        // Intentar obtener el mensaje de error del servidor
        try {
          const errorData = await response.json();
          setError(errorData.error || 'Error al iniciar sesión');
        } catch {
          setError('Error de conexión con el servidor. Verifica que el backend esté corriendo en http://localhost:4000');
        }
        return;
      }

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        // Notificar a App.jsx
        window.dispatchEvent(new Event('auth-change'));
        navigate('/panel');
      } else {
        setError(data.error || 'Error al iniciar sesión');
      }
    } catch (err) {
      console.error('Error de conexión:', err);
      setError('Error de conexión con el servidor. Verifica que el backend esté corriendo en http://localhost:4000');
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-form-box">
        <h2>Bienvenido de vuelta</h2>
        <p>Inicia sesión para continuar en la plataforma.</p>

        {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label htmlFor="email">Correo electrónico</label>
            <input
              type="email"
              id="email"
              placeholder="juan.perez@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-options">
            <label className="remember-me">
              <input type="checkbox" /> Recordarme
            </label>
            <a href="#">¿Olvidaste tu contraseña?</a>
          </div>
          <button type="submit" className="btn-login-submit">Iniciar Sesión</button>
        </form>
        <p className="signup-link">
          ¿No tienes una cuenta? <Link to="/registro">Crear cuenta</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;