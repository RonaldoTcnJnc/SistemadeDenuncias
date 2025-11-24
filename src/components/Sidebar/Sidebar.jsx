import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Sidebar.css';
// Íconos
import { FiGrid, FiPlusCircle, FiFileText, FiUser, FiLogOut } from 'react-icons/fi';

const Sidebar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Aquí iría la lógica de logout real (limpiar tokens, etc.)
        console.log('Cerrando sesión...');
        // Limpiar posibles tokens o datos de sesión almacenados
        try {
            localStorage.removeItem('token');
            localStorage.removeItem('authToken');
        } catch (e) {
            // ignorar si no es accesible
        }
        try { sessionStorage.clear(); } catch (e) { }
        // Redirigir a la página principal
        navigate('/');
    };

    return (
        <aside className="sidebar-container">
            <div className="sidebar-header">
                Plataforma <br/> Ciudadana
            </div>
            <nav className="sidebar-nav">
                <NavLink to="/panel" className="sidebar-link">
                    <FiGrid /> Panel del Ciudadano
                </NavLink>
                <NavLink to="/nueva-denuncia" className="sidebar-link">
                    <FiPlusCircle /> Nueva denuncia
                </NavLink>
                <NavLink to="/mis-denuncias" className="sidebar-link">
                    <FiFileText /> Mis denuncias
                </NavLink>
                <NavLink to="/perfil" className="sidebar-link">
                    <FiUser /> Perfil
                </NavLink>
            </nav>
            <div className="sidebar-footer">
                <button onClick={handleLogout} className="logout-btn">
                    <FiLogOut /> Cerrar sesión
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;