import React, { useState, useMemo } from 'react';
import AuthorityLayout from './AuthorityLayout';
import './Estadisticas.css';
import { FiTrendingUp, FiCheckCircle, FiClock, FiAlertCircle, FiUsers, FiBarChart2, FiDownload } from 'react-icons/fi';

// Gráfico de líneas mejorado con ejes
const ChartLine = ({data = [], labels = [], color = '#2563eb', height = 280}) => {
  const w = 600; const h = height; const padding = 50;
  const max = Math.max(...data, 10);
  const points = data.map((v,i) => {
    const x = padding + (i * ( (w - padding*2) / (Math.max(data.length-1, 1)) ));
    const y = padding + ( (1 - v / max) * (h - padding*2) );
    return `${x},${y}`;
  }).join(' ');
  
  // Líneas de cuadrícula horizontales
  const gridLines = [];
  for (let i = 0; i <= 5; i++) {
    const y = padding + (i * (h - padding*2) / 5);
    const value = Math.round(max - (max / 5) * i);
    gridLines.push(
      <g key={`grid-${i}`}>
        <line x1={padding} y1={y} x2={w - padding/2} y2={y} stroke="#e5e7eb" strokeWidth="1" strokeDasharray="4" />
        <text x={padding - 8} y={y + 4} fontSize="11" textAnchor="end" fill="#6b7280">{value}</text>
      </g>
    );
  }
  
  // Etiquetas del eje X
  const xLabels = data.map((v, i) => {
    const x = padding + (i * ( (w - padding*2) / (Math.max(data.length-1, 1)) ));
    const label = labels[i] || `${i+1}`;
    return (
      <text key={`label-${i}`} x={x} y={h - 10} fontSize="11" textAnchor="middle" fill="#6b7280">{label}</text>
    );
  });

  return (
    <svg className="chart-svg" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{height: '280px'}}>
      <rect x="0" y="0" width="100%" height="100%" fill="transparent" />
      
      {/* Líneas de cuadrícula */}
      {gridLines}
      
      {/* Ejes */}
      <line x1={padding} y1={padding} x2={padding} y2={h - padding} stroke="#111827" strokeWidth="2" />
      <line x1={padding} y1={h - padding} x2={w - padding/2} y2={h - padding} stroke="#111827" strokeWidth="2" />
      
      {/* Punta de flecha eje Y */}
      <polygon points={`${padding},${padding - 5} ${padding - 3},${padding + 5} ${padding + 3},${padding + 5}`} fill="#111827" />
      
      {/* Punta de flecha eje X */}
      <polygon points={`${w - padding/2 + 5},${h - padding} ${w - padding/2 - 5},${h - padding - 3} ${w - padding/2 - 5},${h - padding + 3}`} fill="#111827" />
      
      {/* Línea del gráfico */}
      <polyline fill="none" stroke={color} strokeWidth="3" points={points} strokeLinecap="round" strokeLinejoin="round" />
      
      {/* Puntos */}
      {data.map((v,i)=>{
        const x = padding + (i * ( (w - padding*2) / (Math.max(data.length-1, 1)) ));
        const y = padding + ( (1 - v / max) * (h - padding*2) );
        return <circle key={i} cx={x} cy={y} r="4" fill={color} />
      })}
      
      {/* Etiquetas X */}
      {xLabels}
    </svg>
  );
}

// Gráfico de barras mejorado con ejes
const ChartBars = ({items = [], height = 280}) => {
  const w = 600; const h = height; const padding = 50;
  const gap = 12;
  const barWidth = (w - padding*2 - (items.length-1)*gap) / items.length;
  const max = Math.max(...items.map(i=>i.value), 10);
  
  // Líneas de cuadrícula horizontales
  const gridLines = [];
  for (let i = 0; i <= 5; i++) {
    const y = h - padding - (i * (h - padding*2) / 5);
    const value = Math.round((max / 5) * i);
    gridLines.push(
      <g key={`grid-${i}`}>
        <line x1={padding} y1={y} x2={w - padding/2} y2={y} stroke="#e5e7eb" strokeWidth="1" strokeDasharray="4" />
        <text x={padding - 8} y={y + 4} fontSize="11" textAnchor="end" fill="#6b7280">{value}</text>
      </g>
    );
  }
  
  return (
    <svg className="chart-svg" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{height: '280px'}}>
      {/* Líneas de cuadrícula */}
      {gridLines}
      
      {/* Ejes */}
      <line x1={padding} y1={padding} x2={padding} y2={h - padding} stroke="#111827" strokeWidth="2" />
      <line x1={padding} y1={h - padding} x2={w - padding/2} y2={h - padding} stroke="#111827" strokeWidth="2" />
      
      {/* Punta de flecha eje Y */}
      <polygon points={`${padding},${padding - 5} ${padding - 3},${padding + 5} ${padding + 3},${padding + 5}`} fill="#111827" />
      
      {/* Punta de flecha eje X */}
      <polygon points={`${w - padding/2 + 5},${h - padding} ${w - padding/2 - 5},${h - padding - 3} ${w - padding/2 - 5},${h - padding + 3}`} fill="#111827" />
      
      {/* Barras y etiquetas */}
      {items.map((it, idx) => {
        const x = padding + idx * (barWidth + gap);
        const bh = (it.value / max) * (h - padding*2);
        const y = h - padding - bh;
        return (
          <g key={idx}>
            <rect x={x} y={y} width={barWidth} height={bh} rx={6} fill={it.color || '#60a5fa'} opacity="0.8" />
            <text x={x + barWidth/2} y={h - 15} fontSize="11" textAnchor="middle" fill="#374151" fontWeight="500">{it.name}</text>
            <text x={x + barWidth/2} y={y - 6} fontSize="11" textAnchor="middle" fill="#111827" fontWeight="600">{it.value}</text>
          </g>
        )
      })}
    </svg>
  );
}

// Gráfico de pastel
const ChartPie = ({items = [], size = 260}) => {
  const radius = Math.floor(size * 0.28);
  const inner = Math.floor(size * 0.14);
  const total = items.reduce((sum, item) => sum + item.value, 0) || 1;
  
  let currentAngle = -90;
  const slices = items.map((item, idx) => {
    const sliceAngle = (item.value / total) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + sliceAngle;
    
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;
    
    const x1 = size / 2 + radius * Math.cos(startRad);
    const y1 = size / 2 + radius * Math.sin(startRad);
    const x2 = size / 2 + radius * Math.cos(endRad);
    const y2 = size / 2 + radius * Math.sin(endRad);
    
    const largeArc = sliceAngle > 180 ? 1 : 0;
    const pathData = `M ${size/2} ${size/2} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
    
    currentAngle = endAngle;
    
    return (
      <path key={idx} d={pathData} fill={item.color} opacity="0.95" />
    );
  });
  
  return (
    <svg viewBox={`0 0 ${size} ${size}`} style={{ width: `${size}px`, height: `${size}px` }}>
      {slices}
      <circle cx={size/2} cy={size/2} r={inner} fill="white" />
      <text x={size/2} y={size/2} textAnchor="middle" dominantBaseline="middle" fontSize={14} fontWeight={700} fill="#111827">{total}</text>
    </svg>
  );
}

const Estadisticas = () => {
  const [filtroMes, setFiltroMes] = useState('todos');
  const [filtroCategoria, setFiltroCategoria] = useState('todos');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // 1-12
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Datos de ejemplo
  const datosResumen = {
    totalDenuncias: 765,
    resueltas: 650,
    pendientes: 115,
    enProgreso: 180,
    tasaResolucion: 85,
    tiempoPromedio: 2.5
  };

  const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

  

  // Datos mensuales por año (ejemplo). Las claves son año -> mes(numero) -> categorías
  const sampleMonthlyData = {
    2024: {
      1: { Baches: 60, Farolas: 80, Grafiti: 40, Basura: 70, Señales: 30, Otros: 20 },
      2: { Baches: 55, Farolas: 95, Grafiti: 45, Basura: 68, Señales: 35, Otros: 18 },
      12: { Baches: 100, Farolas: 150, Grafiti: 80, Basura: 120, Señales: 90, Otros: 50 }
    },
    2025: {
      1: { Baches: 120, Farolas: 180, Grafiti: 80, Basura: 150, Señales: 90, Otros: 50 },
      2: { Baches: 95, Farolas: 140, Grafiti: 70, Basura: 110, Señales: 80, Otros: 40 },
      11: { Baches: 110, Farolas: 170, Grafiti: 78, Basura: 148, Señales: 88, Otros: 48 }
    }
  };

  const categoryColors = {
    Baches: '#60a5fa',
    Farolas: '#34d399',
    Grafiti: '#facc15',
    Basura: '#fb7185',
    Señales: '#a78bfa',
    Otros: '#94a3b8'
  };

  const getCategoryDataFor = (year, month) => {
    const yearData = sampleMonthlyData[year] || {};
    const monthData = yearData[month] || {};
    const categories = ['Baches', 'Farolas', 'Grafiti', 'Basura', 'Señales', 'Otros'];
    return categories.map(name => ({ name, value: monthData[name] || 0, color: categoryColors[name] }));
  };

  const denunciasPorCategoria = useMemo(() => getCategoryDataFor(selectedYear, selectedMonth), [selectedYear, selectedMonth]);

  // Datos de estado por mes/año (ejemplo). Si no hay datos, se generan proporcionales.
  const sampleStateMonthlyData = {
    2024: {
      1: { Resuelta: 420, Pendiente: 80, 'En Progreso': 60 },
      2: { Resuelta: 430, Pendiente: 70, 'En Progreso': 65 },
      12: { Resuelta: 560, Pendiente: 100, 'En Progreso': 110 }
    },
    2025: {
      1: { Resuelta: 600, Pendiente: 80, 'En Progreso': 120 },
      2: { Resuelta: 520, Pendiente: 60, 'En Progreso': 110 },
      11: { Resuelta: 580, Pendiente: 90, 'En Progreso': 120 }
    }
  };

  const getStateDataFor = (year, month) => {
    const yearData = sampleStateMonthlyData[year] || {};
    const monthData = yearData[month];
    if (monthData) return [
      { name: 'Resuelta', value: monthData.Resuelta, color: '#22c55e' },
      { name: 'Pendiente', value: monthData.Pendiente, color: '#ef4444' },
      { name: 'En Progreso', value: monthData['En Progreso'], color: '#eab308' },
    ];

    // genera proporciones a partir del total de categorías si no existe un registro explícito
    const cat = getCategoryDataFor(year, month);
    const total = cat.reduce((s, c) => s + c.value, 0) || 1;
    const res = Math.round(total * 0.7);
    const pen = Math.round(total * 0.15);
    const prog = Math.max(0, total - res - pen);
    return [
      { name: 'Resuelta', value: res, color: '#22c55e' },
      { name: 'Pendiente', value: pen, color: '#ef4444' },
      { name: 'En Progreso', value: prog, color: '#eab308' },
    ];
  };

  const estadoPorCategoria = useMemo(() => getStateDataFor(selectedYear, selectedMonth), [selectedYear, selectedMonth]);

  // Genera series mensual para el año seleccionado (puede filtrar por categoría)
  const datosPorMes = useMemo(() => {
    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    return months.map(m => {
      const cat = getCategoryDataFor(selectedYear, m);
      if (filtroCategoria && filtroCategoria !== 'todos') {
        const found = cat.find(c => c.name === filtroCategoria);
        return found ? found.value : 0;
      }
      return cat.reduce((s, c) => s + c.value, 0);
    });
  }, [selectedYear, filtroCategoria]);

  const chartColor = (filtroCategoria && filtroCategoria !== 'todos' && categoryColors[filtroCategoria]) ? categoryColors[filtroCategoria] : '#2563eb';

  const topAutoridades = [
    {nombre: 'Juan García', departamento: 'Vialidad', denuncias: 45, tasa: 92},
    {nombre: 'María López', departamento: 'Alumbrado', denuncias: 38, tasa: 88},
    {nombre: 'Carlos Mendez', departamento: 'Limpieza', denuncias: 32, tasa: 85},
    {nombre: 'Ana Ruiz', departamento: 'Señales', denuncias: 28, tasa: 78},
    {nombre: 'Pedro González', departamento: 'Otros', denuncias: 25, tasa: 72},
  ];

  const actividadReciente = [
    {id: '#12345', problema: 'Bache reparado', autoridad: 'Juan García', tiempo: 'Hace 2 horas'},
    {id: '#12344', problema: 'Farola instalada', autoridad: 'María López', tiempo: 'Hace 5 horas'},
    {id: '#12343', problema: 'Grafiti removido', autoridad: 'Carlos Mendez', tiempo: 'Hace 1 día'},
    {id: '#12342', problema: 'Área limpiada', autoridad: 'Ana Ruiz', tiempo: 'Hace 2 días'},
  ];

  return (
    <AuthorityLayout>
      <div className="authority-dashboard-container">
        {/* Header */}
        <div className="stats-header">
          <div>
            <h1>Informes y Análisis</h1>
            <p className="subtitle">Visualiza tendencias, datos y genera informes personalizados.</p>
          </div>
          <button className="btn-export" title="Descargar reporte">
            <FiDownload size={20} /> Descargar Reporte
          </button>
        </div>

        {/* KPIs principales */}
        <div className="kpis-grid">
          <div className="kpi-card kpi-primary">
            <div className="kpi-icon"><FiBarChart2 size={24} /></div>
            <div className="kpi-content">
              <div className="kpi-label">Total de Denuncias</div>
              <div className="kpi-value">{datosResumen.totalDenuncias}</div>
              <div className="kpi-trend">↑ 12% vs mes anterior</div>
            </div>
          </div>

          <div className="kpi-card kpi-success">
            <div className="kpi-icon"><FiCheckCircle size={24} /></div>
            <div className="kpi-content">
              <div className="kpi-label">Denuncias Resueltas</div>
              <div className="kpi-value">{datosResumen.resueltas}</div>
              <div className="kpi-trend">{datosResumen.tasaResolucion}% de resolución</div>
            </div>
          </div>

          <div className="kpi-card kpi-warning">
            <div className="kpi-icon"><FiClock size={24} /></div>
            <div className="kpi-content">
              <div className="kpi-label">Tiempo Promedio</div>
              <div className="kpi-value">{datosResumen.tiempoPromedio}</div>
              <div className="kpi-trend">días de resolución</div>
            </div>
          </div>

          <div className="kpi-card kpi-alert">
            <div className="kpi-icon"><FiAlertCircle size={24} /></div>
            <div className="kpi-content">
              <div className="kpi-label">Pendientes</div>
              <div className="kpi-value">{datosResumen.pendientes}</div>
              <div className="kpi-trend">En cola de atención</div>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="filters-section">
          <div style={{display:'flex', gap:12, alignItems:'center'}}>
            <label style={{fontSize:13, color:'#374151'}}>Mes:</label>
            <select value={selectedMonth} onChange={(e) => setSelectedMonth(Number(e.target.value))} className="filter-select">
              {meses.map((m, idx) => <option key={m} value={idx+1}>{m}</option>)}
            </select>

            <label style={{fontSize:13, color:'#374151'}}>Año:</label>
            <select value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))} className="filter-select">
              {[2023,2024,2025,2026].map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>

          <div style={{display:'flex', gap:12, alignItems:'center'}}>
            <select value={filtroCategoria} onChange={(e) => setFiltroCategoria(e.target.value)} className="filter-select">
              <option value="todos">Todas las categorías</option>
              <option value="Baches">Baches</option>
              <option value="Farolas">Farolas</option>
              <option value="Grafiti">Grafiti</option>
              <option value="Basura">Basura</option>
              <option value="Señales">Señales</option>
              <option value="Otros">Otros</option>
            </select>
            <button className="btn-export" style={{padding:'8px 12px', fontSize:13}} onClick={() => { setFiltroMes('actual'); }}>
              Aplicar
            </button>
          </div>
        </div>

        {/* Gráficos principales */}
        <div className="charts-row">
          <div className="chart-card">
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
              <h3>Tendencias de Denuncias por Mes</h3>
              <div style={{display:'flex', alignItems:'center', gap:8}}>
                <div style={{width:12, height:12, borderRadius:6, background: chartColor}}></div>
                <div style={{fontSize:13, color:'#374151'}}>{filtroCategoria && filtroCategoria !== 'todos' ? `${filtroCategoria} (mensual)` : 'Total denuncias (mensual)'}</div>
              </div>
            </div>
            <ChartLine data={datosPorMes} labels={meses} color={chartColor} />
          </div>
          <div className="chart-card">
            <h3>Estado General de Denuncias</h3>
            <div className="chart-pie-container">
              <ChartPie items={estadoPorCategoria} size={260} />
              <div className="chart-legend">
                {estadoPorCategoria.map((item, idx) => (
                  <div key={idx} className="legend-item">
                    <span className="legend-color" style={{backgroundColor: item.color}}></span>
                    <span className="legend-text">{item.name}: {item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Categorías y Rendimiento */}
        <div className="charts-row">
          <div className="chart-card">
            <h3>Denuncias por Categoría</h3>
            <ChartBars items={denunciasPorCategoria} />
          </div>
          <div className="chart-card">
            <h3>Top 5 Autoridades</h3>
            <div className="top-list">
              {topAutoridades.map((auth, idx) => (
                <div key={idx} className="top-item">
                  <div className="top-rank">#{idx + 1}</div>
                  <div className="top-info">
                    <div className="top-name">{auth.nombre}</div>
                    <div className="top-dept">{auth.departamento}</div>
                  </div>
                  <div className="top-stats">
                    <span className="stat-number">{auth.denuncias}</span>
                    <span className="stat-label">resueltas</span>
                  </div>
                  <div className="top-badge" style={{backgroundColor: auth.tasa >= 85 ? '#dcfce7' : auth.tasa >= 75 ? '#fef3c7' : '#fee2e2'}}>
                    {auth.tasa}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Actividad reciente */}
        <div className="activity-section">
          <h3>Actividad Reciente</h3>
          <div className="activity-table">
            {actividadReciente.map((act, idx) => (
              <div key={idx} className="activity-row">
                <div className="activity-id">{act.id}</div>
                <div className="activity-problem">{act.problema}</div>
                <div className="activity-author">{act.autoridad}</div>
                <div className="activity-time">{act.tiempo}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Resumen estadístico */}
        <div className="summary-section">
          <h3>Resumen Estadístico</h3>
          <div className="summary-grid">
            <div className="summary-item">
              <div className="summary-title">Tasa de Resolución</div>
              <div className="summary-bar">
                <div className="progress-bar" style={{width: `${datosResumen.tasaResolucion}%`}}></div>
              </div>
              <div className="summary-value">{datosResumen.tasaResolucion}%</div>
            </div>
            <div className="summary-item">
              <div className="summary-title">Denuncias Completadas</div>
              <div className="summary-bar">
                <div className="progress-bar" style={{width: `${(datosResumen.resueltas / datosResumen.totalDenuncias) * 100}%`, backgroundColor: '#22c55e'}}></div>
              </div>
              <div className="summary-value">{datosResumen.resueltas}/{datosResumen.totalDenuncias}</div>
            </div>
          </div>
        </div>
      </div>
    </AuthorityLayout>
  );
};

export default Estadisticas;
