import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Sidebar.css';
// Íconos
import { FiGrid, FiPlusCircle, FiFileText, FiUser, FiLogOut } from 'react-icons/fi';
// Imagen (coloca MisDenuncias.png en src/assets/)
import misDenunciasImg from '../../assets/MisDenuncias.png';

const Sidebar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Aquí iría la lógica de logout real (limpiar tokens, etc.)
        console.log('Cerrando sesión...');
        try {
            localStorage.removeItem('token');
            localStorage.removeItem('authToken');
        } catch (e) { /* ignorar si no es accesible */ }
        try { sessionStorage.clear(); } catch (e) { }
        navigate('/');
    };

    return (
        <aside className="sidebar-container">
            <div className="sidebar-header">
                Plataforma <br/> Ciudadana
            </div>
            <nav className="sidebar-nav">
                <NavLink to="/panel" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                    <FiGrid /> Panel del Ciudadano
                </NavLink>
                <NavLink to="/nueva-denuncia" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                    <FiPlusCircle /> Nueva denuncia
                </NavLink>
                <NavLink to="/mis-denuncias" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                    <FiFileText /> Mis denuncias
                </NavLink>
                <NavLink to="/perfil" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                    <FiUser /> Perfil
                </NavLink>
            </nav>

            {/* Imagen ubicada debajo de los enlaces de navegación */}
            <div className="sidebar-image-container" aria-hidden="true">
                <img src={misDenunciasImg} className="sidebar-image" alt="Mis Denuncias" />
            </div>

            <div className="sidebar-footer">
                <button onClick={handleLogout} className="logout-btn">
                    <FiLogOut /> Cerrar sesión
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;