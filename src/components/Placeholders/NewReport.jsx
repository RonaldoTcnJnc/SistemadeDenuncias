import React, { useState } from 'react';
import './NewReport.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Configurar icono de Leaflet
const defaultIcon = L.icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = defaultIcon;

// Coordenadas de Cusco, Perú
const CUSCO_COORDINATES = [-13.5316, -71.9877];

const categories = ['Vialidad', 'Alumbrado Público', 'Basura', 'Grafiti', 'Señales', 'Otros'];

const NewReport = () => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: categories[0],
    photo: null,
    photoPreview: null,
    location: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const [selectedPos, setSelectedPos] = useState(CUSCO_COORDINATES);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'photo' && files[0]) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm(prev => ({
          ...prev,
          photo: file,
          photoPreview: reader.result
        }));
      };
      reader.readAsDataURL(file);
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Denuncia enviada:', form);
    setSubmitted(true);
    setTimeout(() => {
      setForm({
        title: '',
        description: '',
        category: categories[0],
        photo: null,
        photoPreview: null,
        location: ''
      });
      setSubmitted(false);
    }, 2000);
  };

  if (submitted) {
    return (
      <div className="newreport-container">
        <div className="success-message">
          <h2>✓ Denuncia enviada exitosamente</h2>
          <p>Tu reporte ha sido registrado. Recibirás actualizaciones por correo electrónico.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="newreport-container">
      <h1>Nueva denuncia</h1>
      <div className="card">
        <form onSubmit={handleSubmit} className="report-form">
          <div className="form-group">
            <label>Título *</label>
            <input
              type="text"
              name="title"
              placeholder="Ej: Baches en la calle principal"
              value={form.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Descripción *</label>
            <textarea
              name="description"
              placeholder="Describe el problema con el mayor detalle posible."
              value={form.description}
              onChange={handleChange}
              rows={5}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Categoría *</label>
              <select name="category" value={form.category} onChange={handleChange}>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Foto</label>
            <div className="upload-box">
              <input
                type="file"
                name="photo"
                accept="image/*"
                onChange={handleChange}
              />
              {!form.photoPreview && <small>PNG, JPG, GIF hasta 10MB</small>}
            </div>
            {form.photoPreview && (
              <div className="photo-preview">
                <img src={form.photoPreview} alt="Preview" />
                <button
                  type="button"
                  className="remove-photo"
                  onClick={() => setForm(prev => ({ ...prev, photo: null, photoPreview: null }))}
                >
                  ✕ Remover
                </button>
              </div>
            )}
          </div>

          <div className="form-group">
            <label>Ubicación *</label>
            <input
              type="text"
              name="location"
              placeholder="Ej: Calle Principal, esquina con Avenida Central"
              value={form.location}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Selecciona la ubicación en el mapa</label>
            <MapContainer
              center={selectedPos}
              zoom={13}
              className="map-container"
              onclick={(e) => { /* fallback: MapContainer supports lowercase onclick */ }}
              whenCreated={(map) => { /* keep reference if needed later */ }}
              onClick={(e) => {
                const { lat, lng } = e.latlng;
                setSelectedPos([lat, lng]);
                setForm(prev => ({ ...prev, location: `${lat.toFixed(6)}, ${lng.toFixed(6)}` }));
              }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; OpenStreetMap contributors'
              />
              <Marker
                position={selectedPos}
                draggable={true}
                eventHandlers={{
                  dragend: (event) => {
                    const marker = event.target;
                    const { lat, lng } = marker.getLatLng();
                    setSelectedPos([lat, lng]);
                    setForm(prev => ({ ...prev, location: `${lat.toFixed(6)}, ${lng.toFixed(6)}` }));
                  }
                }}
              >
                <Popup>
                  {`Seleccionado: ${selectedPos[0].toFixed(6)}, ${selectedPos[1].toFixed(6)}`}
                </Popup>
              </Marker>
            </MapContainer>
            <div style={{marginTop:8, color:'#555', fontSize:13}}>
              Coordenadas seleccionadas: {selectedPos[0].toFixed(6)}, {selectedPos[1].toFixed(6)}
            </div>
          </div>

          <button type="submit" className="btn-submit">Enviar denuncia</button>
        </form>
      </div>
    </div>
  );
};

export default NewReport;