import React, { useState } from 'react';
import './AuthorityDashboard.css';
import AuthorityLayout from './AuthorityLayout';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { FiLock, FiShield, FiClock, FiChevronRight } from 'react-icons/fi';

// Reemplaza con tu Google Maps API Key
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY_HERE';

// Coordenadas default para Lima, Perú
const LIMA_COORDINATES = {
  lat: -12.0463,
  lng: -77.0428
};

const mapContainerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '10px'
};

const AuthorityDashboard = () => {
  const [mapMarkers, setMapMarkers] = useState([
    { id: 1, lat: -12.0463, lng: -77.0428, title: 'Lima Centro' }
  ]);

  const handleMapClick = (event) => {
    // Opcional: permitir agregar marcadores al hacer click en el mapa
    const newMarker = {
      id: mapMarkers.length + 1,
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
      title: `Incidente #${mapMarkers.length + 1}`
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
          <h3>Mapa de incidencias de tránsito</h3>
          <p className="muted" style={{marginBottom:'16px'}}>Visualiza los incidentes reportados en Lima y alrededores. Puedes hacer click en el mapa para agregar un nuevo reporte.</p>
          <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
            <GoogleMap 
              mapContainerStyle={mapContainerStyle} 
              center={LIMA_COORDINATES} 
              zoom={12}
              onClick={handleMapClick}
            >
              {mapMarkers.map((marker) => (
                <Marker
                  key={marker.id}
                  position={{ lat: marker.lat, lng: marker.lng }}
                  title={marker.title}
                />
              ))}
            </GoogleMap>
          </LoadScript>
          <div style={{marginTop:'12px', fontSize:'12px', color:'#666'}}>
            <strong>Nota:</strong> Configura tu Google Maps API Key en las variables de entorno para que el mapa funcione completamente.
          </div>
        </div>
      </div>
    </AuthorityLayout>
  );
};

export default AuthorityDashboard;
