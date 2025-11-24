import React, { useState } from 'react';
import './NewReport.css';

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

          <div className="map-placeholder">Mapa (aquí se integraría Mapbox/Leaflet)</div>

          <button type="submit" className="btn-submit">Enviar denuncia</button>
        </form>
      </div>
    </div>
  );
};

export default NewReport;