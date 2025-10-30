import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';
// Íconos
import { FiGrid, FiPlusCircle, FiFileText, FiUser, FiBell } from 'react-icons/fi';

const Sidebar = () => {
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
                <NavLink to="/" className="sidebar-link logout-link">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M16 17L21 12L16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Cerrar sesión
                </NavLink>
            </div>
        </aside>
    );
};

export default Sidebar;