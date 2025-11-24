import React from 'react';
import AuthorityLayout from './AuthorityLayout';
import './Estadisticas.css';

// Small inline example charts (no external deps) ------------------------------------------------
const ChartLine = ({data = [], color = '#2563eb', height = 220}) => {
  const w = 600; const h = height; const padding = 32;
  const max = Math.max(...data, 10);
  const points = data.map((v,i) => {
    const x = padding + (i * ( (w - padding*2) / (data.length-1) ));
    const y = padding + ( (1 - v / max) * (h - padding*2) );
    return `${x},${y}`;
  }).join(' ');
  return (
    <svg className="chart-svg" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      <rect x="0" y="0" width="100%" height="100%" fill="transparent" />
      <polyline fill="none" stroke={color} strokeWidth="3" points={points} strokeLinecap="round" strokeLinejoin="round" />
      {data.map((v,i)=>{
        const x = padding + (i * ( (w - padding*2) / (data.length-1) ));
        const y = padding + ( (1 - v / max) * (h - padding*2) );
        return <circle key={i} cx={x} cy={y} r={4} fill={color} />
      })}
    </svg>
  );
}

const ChartBars = ({items = [], height = 220}) => {
  const w = 600; const h = height; const padding = 24;
  const gap = 12;
  const barWidth = (w - padding*2 - (items.length-1)*gap) / items.length;
  const max = Math.max(...items.map(i=>i.value), 10);
  return (
    <svg className="chart-svg" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      {items.map((it, idx) => {
        const x = padding + idx * (barWidth + gap);
        const bh = (it.value / max) * (h - padding*2);
        const y = h - padding - bh;
        return (
          <g key={idx}>
            <rect x={x} y={y} width={barWidth} height={bh} rx={6} fill={it.color || '#60a5fa'} />
            <text x={x + barWidth/2} y={h - 6} fontSize={12} textAnchor="middle" fill="#374151">{it.name}</text>
          </g>
        )
      })}
    </svg>
  );
}
// -----------------------------------------------------------------------------------------------

const Estadisticas = () => {
  return (
    <AuthorityLayout>
      <div className="authority-dashboard-container">
        <h1>Informes y Análisis</h1>
        <p className="subtitle">Visualiza tendencias, datos y genera informes personalizados.</p>

        <div className="charts-row">
          <div className="chart-card">
            <h3>Tendencias de Denuncias por Mes</h3>
            <ChartLine data={[60,75,80,70,58,50,35,55,78,95,110,120]} color="#2563eb" />
          </div>
          <div className="chart-card">
            <h3>Denuncias por Categoría</h3>
            <ChartBars items={[
              {name:'Baches', value:120, color:'#60a5fa'},
              {name:'Farolas', value:180, color:'#34d399'},
              {name:'Grafiti', value:80, color:'#facc15'},
              {name:'Basura', value:150, color:'#fb7185'},
              {name:'Señales', value:90, color:'#a78bfa'},
              {name:'Otros', value:50, color:'#94a3b8'},
            ]} />
          </div>
        </div>

        <div className="kpis-row">
          <div className="kpi-card">
            <div className="kpi-label">Tiempo de Resolución Promedio</div>
            <div className="kpi-value">2.5 días</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">Tasa de Resolución</div>
            <div className="kpi-value">85%</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">Rendimiento del Equipo</div>
            <div className="kpi-value">Excelente</div>
          </div>
        </div>

        <div className="map-card">
          <h3>Distribución Geográfica de Incidencias</h3>
          <div className="map-placeholder">Mapa interactivo (placeholder)</div>
        </div>
      </div>
    </AuthorityLayout>
  );
};

export default Estadisticas;
