import React, { useState } from 'react';
import './NewReport.css';

const categories = ['Vialidad', 'Alumbrado Público', 'Basura', 'Grafiti', 'Señales', 'Otros'];

const NewReport = () => {
  const [form, setForm] = useState({ title: '', description: '', category: categories[0], photo: null });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'photo') {
      setForm(prev => ({ ...prev, photo: files[0] }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Enviar denuncia', form);
  };

  return (
    <div className="newreport-container">
      <h1>Nueva denuncia</h1>
      <div className="card">
        <form onSubmit={handleSubmit} className="report-form">
          <label>Título</label>
          <input name="title" placeholder="Ej: Baches en la calle principal" value={form.title} onChange={handleChange} required />

          <label>Descripción</label>
          <textarea name="description" placeholder="Describe el problema con el mayor detalle posible." value={form.description} onChange={handleChange} rows={5} required />

          <label>Categoría</label>
          <select name="category" value={form.category} onChange={handleChange}>
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>

          <label>Foto</label>
          <div className="upload-box">
            <input type="file" name="photo" accept="image/*" onChange={handleChange} />
            <small>PNG, JPG, GIF hasta 10MB</small>
          </div>

          <label>Ubicación</label>
          <div className="map-placeholder">Mapa (aquí se integraría Mapbox/Leaflet)</div>

          <button className="primary-btn" type="submit">Enviar denuncia</button>
        </form>
      </div>

      <div className="my-reports-preview">
        <h3>Mis denuncias</h3>
        <div className="report-item small">
          <strong>Poste de luz caído</strong>
          <div className="meta">Alumbrado Público - Reportado el 15/05/2024 <span className="status pending">Pendiente</span></div>
        </div>
        <div className="report-item small">
          <strong>Acumulación de basura en esquina</strong>
          <div className="meta">Basura - Reportado el 12/05/2024 <span className="status in-process">En Proceso</span></div>
        </div>
      </div>
    </div>
  );
};

export default NewReport;
