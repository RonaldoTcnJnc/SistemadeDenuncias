import React, { useState } from 'react';
import './AuthorityDashboard.css';
import AuthorityLayout from './AuthorityLayout';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { FiLock, FiShield, FiClock, FiChevronRight } from 'react-icons/fi';

// Reemplaza con tu Google Maps API Key
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

// Coordenadas default para Cusco, Perú
const CUSCO_COORDINATES = {
  lat: -13.5316,
  lng: -71.9877
};

const mapContainerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '10px'
};

const AuthorityDashboard = () => {
  // Sample incident data (replace with real API data)
  const sampleIncidents = [
    { id: 1, lat: -13.5320, lng: -71.9675, title: 'Accidente leve', type: 'accidente' },
    { id: 2, lat: -13.5235, lng: -71.9780, title: 'Bache grande', type: 'vialidad' },
    { id: 3, lat: -13.5352, lng: -71.9890, title: 'Semáforo dañado', type: 'alumbrado' },
    { id: 4, lat: -13.5280, lng: -71.9950, title: 'Choque múltiple', type: 'accidente' },
    { id: 5, lat: -13.5370, lng: -71.9810, title: 'Vehículo abandonado', type: 'otros' }
  ];

  const [mapMarkers, setMapMarkers] = useState(sampleIncidents);

  const handleMapClick = (event) => {
    // Permitir agregar marcadores al hacer click (opcional)
    const newMarker = {
      id: mapMarkers.length + 1,
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
      title: `Incidente #${mapMarkers.length + 1}`,
      type: 'otros'
    };
    setMapMarkers([...mapMarkers, newMarker]);
  };

  return (
    <AuthorityLayout>
      <div className="authority-dashboard-container">
        <h1>Guía rápida: Denuncia de tránsito (Perú)</h1>
        <p className="subtitle">Pasos recomendados y documentación necesaria para presentar una denuncia de tránsito conforme a normas y buenas prácticas en Perú.</p>

        <div className="card steps-card">
          <h3>Pasos a seguir</h3>
          <ol className="steps-list">
            <li className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <strong>Prioriza la seguridad y asistencia.</strong>
                <div className="muted">Si hay lesionados o riesgo inminente, solicita ayuda a la Policía Nacional del Perú o servicios de emergencia y resguarda la escena.</div>
              </div>
            </li>
            <li className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <strong>Recolecta pruebas en el lugar.</strong>
                <div className="muted">Toma fotografías y videos (placas, daños, señalización, ubicación). Anota fecha, hora, punto exacto y condiciones (clima, iluminación).</div>
              </div>
            </li>
            <li className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <strong>Identifica a las partes y testigos.</strong>
                <div className="muted">Anota nombres, números de documento, teléfonos, y testimonios de testigos si los hay.</div>
              </div>
            </li>
            <li className="step">
              <div className="step-number">4</div>
              <div className="step-content">
                <strong>Guarda documentación y comprobantes.</strong>
                <div className="muted">Reúne licencia de conducir, SOAT, tarjeta de propiedad, y cualquier boleta o certificado médico si corresponde.</div>
              </div>
            </li>
            <li className="step">
              <div className="step-number">5</div>
              <div className="step-content">
                <strong>Presenta la denuncia ante la autoridad competente.</strong>
                <div className="muted">Dependiendo del caso puede ser la comisaría, la municipalidad (dirección de tránsito) o la Fiscalía en casos con lesiones graves. Verifica la vía de presentación (presencial o en línea) en tu municipalidad.</div>
              </div>
            </li>
            <li className="step">
              <div className="step-number">6</div>
              <div className="step-content">
                <strong>Solicita copia de tu denuncia y seguimiento.</strong>
                <div className="muted">Pide el número de expediente o constancia y los plazos estimados para la respuesta o resolución.</div>
              </div>
            </li>
          </ol>

          <div className="checklist card">
            <h4>Documentos y pruebas recomendadas</h4>
            <ul className="required-list">
              <li>Fotos y videos del incidente</li>
              <li>Documento de identidad (DNI/RUC)</li>
              <li>Licencia de conducir y SOAT (si aplica)</li>
              <li>Placas y modelo del vehículo involucrado</li>
              <li>Contactos de testigos</li>
              <li>Boletas, partes o certificados médicos (si hay lesiones)</li>
            </ul>
          </div>

          <div className="note muted">
            Esta guía resume pasos habituales y buenas prácticas. Para procedimientos y requisitos formales revisa la web de tu municipalidad o consulta con la Policía Nacional / Fiscalía según el caso.
          </div>

          <div style={{marginTop:16, textAlign:'right'}}>
            <button className="start-button">Iniciar nueva denuncia</button>
          </div>
        </div>

        <div className="card map-card" style={{marginTop:20}}>
          <h3>Mapa de incidencias de tránsito (Cusco)</h3>
          <p className="muted" style={{marginBottom:'16px'}}>Visualiza los incidentes reportados en Cusco. Los pines muestran el tipo de incidencia.</p>
          {!GOOGLE_MAPS_API_KEY ? (
            <div className="map-error">
              <p><strong>Google Maps API Key no configurada.</strong> Usa `.env` y define `VITE_GOOGLE_MAPS_API_KEY` para ver el mapa interactivo.</p>
              <div style={{width:'100%', height:400, borderRadius:6, overflow:'hidden', border:'1px solid #ddd'}}>
                <iframe
                  title="OSM Cusco fallback"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  scrolling="no"
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${CUSCO_COORDINATES.lng-0.05}%2C${CUSCO_COORDINATES.lat-0.03}%2C${CUSCO_COORDINATES.lng+0.05}%2C${CUSCO_COORDINATES.lat+0.03}&layer=mapnik&marker=${CUSCO_COORDINATES.lat}%2C${CUSCO_COORDINATES.lng}`}
                />
              </div>
            </div>
          ) : (
            <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY} onError={() => console.error('Error cargando Google Maps')}>
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={CUSCO_COORDINATES}
                zoom={13}
                onClick={handleMapClick}
              >
                {mapMarkers.map((marker) => {
                  // choose color by type
                  const colorMap = {
                    accidente: 'red',
                    vialidad: 'orange',
                    alumbrado: 'yellow',
                    otros: 'blue'
                  };
                  const color = colorMap[marker.type] || 'purple';
                  const iconUrl = `https://maps.google.com/mapfiles/ms/icons/${color}-dot.png`;
                  return (
                    <Marker
                      key={marker.id}
                      position={{ lat: marker.lat, lng: marker.lng }}
                      title={marker.title}
                      icon={{ url: iconUrl }}
                    />
                  );
                })}
              </GoogleMap>
            </LoadScript>
          )}
          <div style={{marginTop:'12px', fontSize:'12px', color:'#666'}}>
            <strong>Nota:</strong> Si deseas que estos pines vengan de la base de datos, puedo conectarlos a la API y mostrarlos dinámicamente.
          </div>
        </div>
      </div>
    </AuthorityLayout>
  );
};

export default AuthorityDashboard;
