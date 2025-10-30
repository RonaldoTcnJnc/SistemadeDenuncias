import React from 'react';
import Sidebar from '../Sidebar/Sidebar';
import './DashboardLayout.css';
import { FiBell } from 'react-icons/fi';


const DashboardLayout = ({ children }) => {
    return (
        <div className="dashboard-layout-container">
            <Sidebar />
            <div className="dashboard-main-content">
                <header className="dashboard-header">
                    <div>{/* Espacio para breadcrumbs o título */}</div>
                    <div className="user-section">
                        <FiBell size={22} className="notification-icon" />
                        {/* Aquí iría el avatar del usuario */}
                    </div>
                </header>
                <main className="dashboard-page-content">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;