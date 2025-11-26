import React, { useState, useMemo } from 'react';
import AuthorityLayout from './AuthorityLayout';
import './Denuncias.css';
import { GoogleMap, Marker, useJsApiLoader, InfoWindow } from '@react-google-maps/api';

// Google Maps API Key
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

// Coordenadas de Cusco, Perú
const CUSCO_CENTER = {
  lat: -13.5316,
  lng: -71.9877
};

const mapContainerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '8px'
};

const sample = [
  { id: '#12345', problema: 'Bache', ubicacion: 'Calle Principal', estado: 'Resuelta', fecha: '2024-01-15', distrito: 'Norte', lat: -13.5280, lng: -71.9850 },
  { id: '#12346', problema: 'Farola Rota', ubicacion: 'Avenida del Roble', estado: 'Pendiente', fecha: '2024-01-16', distrito: 'Sur', lat: -13.5350, lng: -71.9920 },
  { id: '#12347', problema: 'Grafiti', ubicacion: 'Calle del Olmo', estado: 'En Progreso', fecha: '2024-01-17', distrito: 'Norte', lat: -13.5240, lng: -71.9780 },
  { id: '#12348', problema: 'Inundación', ubicacion: 'Camino del Rio', estado: 'Resuelta', fecha: '2024-01-18', distrito: 'Este', lat: -13.5320, lng: -71.9710 },
  { id: '#12349', problema: 'Señal Dañada', ubicacion: 'Paso del Parque', estado: 'Pendiente', fecha: '2024-01-19', distrito: 'Oeste', lat: -13.5316, lng: -71.9910 },
  { id: '#12350', problema: 'Vertido', ubicacion: 'Río Seco', estado: 'Pendiente', fecha: '2024-01-20', distrito: 'Norte', lat: -13.5235, lng: -71.9780 },
  { id: '#12351', problema: 'Alcantarilla tapada', ubicacion: 'Plaza Central', estado: 'En Progreso', fecha: '2024-01-21', distrito: 'Sur', lat: -13.5352, lng: -71.9890 },
];

const Denuncias = () => {
  const [query, setQuery] = useState('');
  const [estado, setEstado] = useState('Todos');
  const [distrito, setDistrito] = useState('Todos');
  const [selectedMarker, setSelectedMarker] = useState(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    id: 'denuncias-map'
  });

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

  const getMarkerColor = (estado) => {
    switch (estado) {
      case 'Resuelta':
        return 'green';
      case 'Pendiente':
        return 'red';
      case 'En Progreso':
        return 'yellow';
      default:
        return 'blue';
    }
  };

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
          <h3>Mapa de Denuncias (Cusco)</h3>
          <p className="muted" style={{marginBottom:'16px'}}>Visualización geográfica de todas las denuncias reportadas en Cusco. Los pines están coloreados según el estado.</p>
          
          {(!GOOGLE_MAPS_API_KEY || loadError) ? (
            <div style={{padding:'20px', textAlign:'center', color:'#666'}}>
              <p><strong>Google Maps no está disponible.</strong> Configura `VITE_GOOGLE_MAPS_API_KEY` en `.env` para ver el mapa.</p>
              <div style={{width:'100%', height:400, borderRadius:8, overflow:'hidden', border:'1px solid #ddd', marginTop:'12px'}}>
                <iframe
                  title="OSM Cusco fallback"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  scrolling="no"
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${CUSCO_CENTER.lng-0.06}%2C${CUSCO_CENTER.lat-0.04}%2C${CUSCO_CENTER.lng+0.06}%2C${CUSCO_CENTER.lat+0.04}&layer=mapnik&marker=${CUSCO_CENTER.lat}%2C${CUSCO_CENTER.lng}`}
                />
              </div>
            </div>
          ) : (
            isLoaded ? (
              <div>
                <GoogleMap
                  mapContainerStyle={mapContainerStyle}
                  center={CUSCO_CENTER}
                  zoom={13}
                >
                  {sample.map((denuncia) => (
                    <Marker
                      key={denuncia.id}
                      position={{ lat: denuncia.lat, lng: denuncia.lng }}
                      title={denuncia.problema}
                      icon={{
                        url: `https://maps.google.com/mapfiles/ms/icons/${getMarkerColor(denuncia.estado)}-dot.png`
                      }}
                      onClick={() => setSelectedMarker(denuncia)}
                    >
                      {selectedMarker && selectedMarker.id === denuncia.id && (
                        <InfoWindow onCloseClick={() => setSelectedMarker(null)}>
                          <div style={{fontSize:'14px', color:'#333', padding:'4px'}}>
                            <strong>{denuncia.problema}</strong><br/>
                            <small>{denuncia.ubicacion}</small><br/>
                            <small>Estado: {denuncia.estado}</small>
                          </div>
                        </InfoWindow>
                      )}
                    </Marker>
                  ))}
                </GoogleMap>
                <div style={{marginTop:'12px', fontSize:'12px', color:'#666'}}>
                  <strong>Leyenda:</strong> <span style={{color:'green'}}>●</span> Resuelta | <span style={{color:'red'}}>●</span> Pendiente | <span style={{color:'#FFD700'}}>●</span> En Progreso
                </div>
              </div>
            ) : (
              <div style={{width:'100%', height:400, display:'flex', alignItems:'center', justifyContent:'center', backgroundColor:'#f5f5f5', borderRadius:'8px'}}>
                <p>Cargando mapa...</p>
              </div>
            )
          )}
        </div>

      </div>
    </AuthorityLayout>
  );
};

export default Denuncias;
