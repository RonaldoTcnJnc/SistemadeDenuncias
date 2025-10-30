import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';
// Importa íconos (necesitarás instalar react-icons: npm install react-icons)
import { FiAlertCircle, FiCheckCircle, FiSearch, FiTwitter, FiFacebook } from 'react-icons/fi';


const Header = () => (
  <header className="home-header">
    <div className="home-container">
      <div className="logo">DenunciaYA</div>
      <nav>
        <Link to="/">Inicio</Link>
        <Link to="/panel">Reportes</Link>
        <Link to="#">Ayuda</Link>
      </nav>
      <div className="header-buttons">
        <Link to="/panel" className="btn btn-primary">Reportar Incidencia</Link>
        <Link to="/iniciar-sesion" className="btn btn-secondary">Iniciar sesión</Link>
      </div>
    </div>
  </header>
);

const Footer = () => (
    <footer className="home-footer">
        <div className="home-container">
            <div className="logo">DenunciaYA</div>
            <p>© 2024 DenunciaYA. Todos los derechos reservados.</p>
            <div className="social-icons">
                <a href="#"><FiTwitter /></a>
                <a href="#"><FiFacebook /></a>
            </div>
        </div>
    </footer>
);

const HomePage = () => {
  return (
    <div className="homepage-wrapper">
        <Header />
        <main className="hero-section">
            <div className="hero-overlay"></div>
            <div className="hero-content">
                <h1>Tu ciudad, tu voz, tu solución</h1>
                <p>Reporta problemas urbanos y colabora con tu comunidad para construir una ciudad mejor para todos.</p>
                <div className="hero-buttons">
                    <Link to="/panel" className="btn btn-success">Reportar Incidencia</Link>
                    <Link to="/panel" className="btn btn-outline">Ver Reportes</Link>
                </div>
            </div>
        </main>
        <section className="process-section">
            <div className="home-container">
                <h2>Un proceso simple y transparente</h2>
                <p>Mejorar tu entorno nunca fue tan fácil. Sigue estos tres sencillos pasos.</p>
                <div className="steps-container">
                    <div className="step-card">
                        <div className="step-icon info"><FiAlertCircle size={24}/></div>
                        <h3>1. Reporta</h3>
                        <p>Crea un reporte con detalles y adjunta fotos. Tu voz es el primer paso para el cambio.</p>
                    </div>
                    <div className="step-card">
                        <div className="step-icon review"><FiSearch size={24}/></div>
                        <h3>2. Revisa</h3>
                        <p>Sigue el estado de tu reporte y recibe notificaciones. La transparencia es clave.</p>
                    </div>
                    <div className="step-card">
                        <div className="step-icon resolve"><FiCheckCircle size={24}/></div>
                        <h3>3. Resuelve</h3>
                        <p>Celebra cuando el problema se solucione. Juntos, logramos una ciudad mejor.</p>
                    </div>
                </div>
            </div>
        </section>
        <Footer />
    </div>
  );
};

export default HomePage;