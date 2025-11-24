import React from 'react';
import './AuthorityDashboard.css';
import AuthorityLayout from './AuthorityLayout';
import { FiLock, FiShield, FiClock, FiChevronRight } from 'react-icons/fi';

const AuthorityDashboard = () => {
  return (
    <AuthorityLayout>
      <div className="authority-dashboard-container">
        <h1>Dashboard de Autoridades</h1>
        <p className="subtitle">Un resumen de las denuncias y estadísticas de la ciudad.</p>

        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-label">Total de Denuncias</div>
            <div className="stat-value">1,250</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Denuncias Resueltas</div>
            <div className="stat-value">980</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Denuncias Pendientes</div>
            <div className="stat-value">270</div>
          </div>
        </div>

        <div className="card">
          <h3>Listado de Denuncias</h3>
          <div className="filters-row" style={{marginBottom: '12px'}}>
            <div style={{flex:1}}></div>
            <div style={{display:'flex', gap:10}}>
              <select>
                <option>Filtrar por estado</option>
              </select>
              <select>
                <option>Filtrar por distrito</option>
              </select>
            </div>
          </div>

          <table className="denuncias-table">
            <thead>
              <tr><th>ID</th><th>PROBLEMA</th><th>UBICACIÓN</th><th>ESTADO</th><th>FECHA</th></tr>
            </thead>
            <tbody>
              <tr>
                <td className="mono">#12345</td>
                <td>Bache</td>
                <td>Calle Principal</td>
                <td><span className="badge badge--resuelta">Resuelta</span></td>
                <td>2024-01-15</td>
              </tr>
              <tr>
                <td className="mono">#12346</td>
                <td>Farola Rota</td>
                <td>Avenida del Roble</td>
                <td><span className="badge badge--pendiente">Pendiente</span></td>
                <td>2024-01-16</td>
              </tr>
              <tr>
                <td className="mono">#12347</td>
                <td>Grafiti</td>
                <td>Calle del Olmo</td>
                <td><span className="badge badge--enprogreso">En Progreso</span></td>
                <td>2024-01-17</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="card map-card" style={{marginTop:20}}>
          <h3>Mapa de Denuncias</h3>
          <div className="map-placeholder">Mapa de incidencias (placeholder)</div>
        </div>

        <aside style={{display:'none'}} className="side-column">
          <div className="card security-card">
            <h3>Seguridad</h3>
            <div className="security-item">
              <div className="label"><span className="icon icon-blue"><FiLock /></span> <span>Cambiar contraseña</span></div>
              <FiChevronRight />
            </div>
            <div className="security-item">
              <div className="label"><span className="icon icon-green"><FiShield /></span> <span>Autenticación de dos factores</span></div>
              <FiChevronRight />
            </div>
            <div className="security-item">
              <div className="label"><span className="icon icon-gray"><FiClock /></span> <span>Actividad de la cuenta</span></div>
              <FiChevronRight />
            </div>
          </div>
        </aside>
      </div>
    </AuthorityLayout>
  );
};

export default AuthorityDashboard;
