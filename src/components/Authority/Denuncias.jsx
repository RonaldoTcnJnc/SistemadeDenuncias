import React, { useState, useMemo } from 'react';
import AuthorityLayout from './AuthorityLayout';
import './Denuncias.css';

const sample = [
  { id: '#12345', problema: 'Bache', ubicacion: 'Calle Principal', estado: 'Resuelta', fecha: '2024-01-15', distrito: 'Norte' },
  { id: '#12346', problema: 'Farola Rota', ubicacion: 'Avenida del Roble', estado: 'Pendiente', fecha: '2024-01-16', distrito: 'Sur' },
  { id: '#12347', problema: 'Grafiti', ubicacion: 'Calle del Olmo', estado: 'En Progreso', fecha: '2024-01-17', distrito: 'Norte' },
  { id: '#12348', problema: 'Inundación', ubicacion: 'Camino del Rio', estado: 'Resuelta', fecha: '2024-01-18', distrito: 'Este' },
  { id: '#12349', problema: 'Señal Dañada', ubicacion: 'Paso del Parque', estado: 'Pendiente', fecha: '2024-01-19', distrito: 'Oeste' },
  { id: '#12350', problema: 'Vertido', ubicacion: 'Río Seco', estado: 'Pendiente', fecha: '2024-01-20', distrito: 'Norte' },
  { id: '#12351', problema: 'Alcantarilla tapada', ubicacion: 'Plaza Central', estado: 'En Progreso', fecha: '2024-01-21', distrito: 'Sur' },
];

const Denuncias = () => {
  const [query, setQuery] = useState('');
  const [estado, setEstado] = useState('Todos');
  const [distrito, setDistrito] = useState('Todos');

  const estados = ['Todos', 'Resuelta', 'Pendiente', 'En Progreso'];
  const distritos = useMemo(() => ['Todos', ...Array.from(new Set(sample.map(s => s.distrito)))], []);

  const filtered = sample.filter(s => {
    if (estado !== 'Todos' && s.estado !== estado) return false;
    if (distrito !== 'Todos' && s.distrito !== distrito) return false;
    if (query && !(`${s.problema} ${s.ubicacion} ${s.id}`.toLowerCase().includes(query.toLowerCase()))) return false;
    return true;
  });

  const totals = useMemo(() => {
    const total = sample.length;
    const resueltas = sample.filter(s => s.estado === 'Resuelta').length;
    const pendientes = sample.filter(s => s.estado === 'Pendiente').length;
    return { total, resueltas, pendientes };
  }, []);

  return (
    <AuthorityLayout>
      <div className="authority-dashboard-container">
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-label">Total de Denuncias</div>
            <div className="stat-value">{totals.total}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Denuncias Resueltas</div>
            <div className="stat-value">{totals.resueltas}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Denuncias Pendientes</div>
            <div className="stat-value">{totals.pendientes}</div>
          </div>
        </div>
        <div className="card">
          <h3>Listado de Denuncias</h3>
          <div className="filters-row">
            <input placeholder="Buscar por problema, ubicación o id" value={query} onChange={e=>setQuery(e.target.value)} />
            <select value={estado} onChange={e=>setEstado(e.target.value)}>
              {estados.map(e=> <option key={e} value={e}>{e}</option>)}
            </select>
            <select value={distrito} onChange={e=>setDistrito(e.target.value)}>
              {distritos.map(d=> <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          <table className="denuncias-table">
            <thead>
              <tr><th>ID</th><th>Problema</th><th>Ubicación</th><th>Distrito</th><th>Estado</th><th>Fecha</th></tr>
            </thead>
            <tbody>
              {filtered.map(r => (
                <tr key={r.id}>
                  <td className="mono">{r.id}</td>
                  <td>{r.problema}</td>
                  <td>{r.ubicacion}</td>
                  <td>{r.distrito}</td>
                  <td><span className={`badge ${r.estado === 'Resuelta' ? 'badge--resuelta' : r.estado === 'Pendiente' ? 'badge--pendiente' : 'badge--enprogreso'}`}>{r.estado}</span></td>
                  <td>{r.fecha}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card map-card">
          <h3>Mapa de Denuncias</h3>
          <div className="map-placeholder">Mapa aquí (integrar mapa real si se desea)</div>
        </div>

      </div>
    </AuthorityLayout>
  );
};

export default Denuncias;
