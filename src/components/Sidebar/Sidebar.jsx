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
        </aside>
    );
};

export default Sidebar;