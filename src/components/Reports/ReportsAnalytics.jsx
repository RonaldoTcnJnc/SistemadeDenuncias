import React from 'react';
import './ReportsAnalytics.css';

const ReportsAnalytics = () => {
  return (
    <div className="reports-analytics-page">
      <h1>Informes y Análisis</h1>

      <div className="top-row">
        <div className="card chart-card">
          <h3>Tendencias de Denuncias por Mes</h3>
          <div className="chart-placeholder">[Gráfico de líneas]</div>
        </div>

        <div className="card chart-card">
          <h3>Denuncias por Categoría</h3>
          <div className="chart-placeholder">[Gráfico de barras]</div>
        </div>
      </div>

      <div className="metrics-row">
        <div className="metric"> <div className="metric-title">Tiempo de Resolución Promedio</div> <div className="metric-value">2.5 días</div> </div>
        <div className="metric"> <div className="metric-title">Tasa de Resolución</div> <div className="metric-value">85%</div> </div>
        <div className="metric"> <div className="metric-title">Rendimiento del Equipo</div> <div className="metric-value">Excelente</div> </div>
      </div>

      <div className="geo-card card">
        <h3>Distribución Geográfica de Incidencias</h3>
        <div className="map-large">[Mapa interactivo aquí]</div>
      </div>
    </div>
  );
};

export default ReportsAnalytics;
