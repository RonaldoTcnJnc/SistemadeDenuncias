import React, { useState } from 'react';
import './NewReport.css';
import { GoogleMap, LoadScript, Marker, Autocomplete } from '@react-google-maps/api';

// Google Maps API Key (usa .env variable VITE_GOOGLE_MAPS_API_KEY)
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY_HERE';

// Coordenadas de Cusco, Perú
const CUSCO_COORDINATES = { lat: -13.5316, lng: -71.9877 };

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
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [autocomplete, setAutocomplete] = useState(null);

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

  const handleLocateMe = () => {
    if (!navigator.geolocation) return alert('Geolocalización no soportada por tu navegador');
    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude, longitude } = pos.coords;
      setSelectedPos({ lat: latitude, lng: longitude });
      setForm(prev => ({ ...prev, location: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}` }));
    }, (err) => {
      console.error(err);
      alert('No se pudo obtener la ubicación. Comprueba permisos.');
    });
  };

  // handle search via Autocomplete place
  const onLoadAutocomplete = (auto) => setAutocomplete(auto);
  const onPlaceChanged = () => {
    if (!autocomplete) return;
    const place = autocomplete.getPlace();
    if (!place.geometry || !place.geometry.location) {
      alert('No se encontró la ubicación seleccionada en Places');
      return;
    }
    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();
    setSelectedPos({ lat, lng });
    setForm(prev => ({ ...prev, location: place.formatted_address || `${lat.toFixed(6)}, ${lng.toFixed(6)}` }));
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
            <div className="map-controls">
              <div className="search-box">
                <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY} libraries={["places"]}>
                  <Autocomplete onLoad={onLoadAutocomplete} onPlaceChanged={onPlaceChanged}>
                    <input
                      type="text"
                      placeholder="Buscar dirección o lugar (ej: Plaza de Armas Cusco)"
                      className="gm-search-input"
                    />
                  </Autocomplete>
                </LoadScript>
                <button type="button" className="btn-small" onClick={handleLocateMe}>Ubicarme</button>
              </div>
            </div>

            <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY} libraries={["places"]}>
              <GoogleMap
                mapContainerStyle={{ width: '100%', height: '400px', borderRadius: 6 }}
                center={selectedPos}
                zoom={13}
                onClick={(e) => {
                  const lat = e.latLng.lat();
                  const lng = e.latLng.lng();
                  setSelectedPos({ lat, lng });
                  setForm(prev => ({ ...prev, location: `${lat.toFixed(6)}, ${lng.toFixed(6)}` }));
                }}
              >
                <Marker
                  position={selectedPos}
                  draggable={true}
                  onDragEnd={(e) => {
                    const lat = e.latLng.lat();
                    const lng = e.latLng.lng();
                    setSelectedPos({ lat, lng });
                    setForm(prev => ({ ...prev, location: `${lat.toFixed(6)}, ${lng.toFixed(6)}` }));
                  }}
                />
              </GoogleMap>
            </LoadScript>
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