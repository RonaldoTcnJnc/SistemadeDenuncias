import React, { useState } from 'react';
import './MyReports.css';
import './ReportDetails.css';

const sampleReports = [
  { 
    id: 1, 
    title: 'Poste de luz caído', 
    category: 'Alumbrado Público', 
    date: '15/05/2024', 
    status: 'Pendiente',
    description: 'El poste de luz en la esquina de la calle principal se encuentra completamente caído, representando un peligro para peatones y vehículos.',
    photo: 'https://via.placeholder.com/400x300',
    location: 'Av. Principal esq. Calle 1'
  },
  { 
    id: 2, 
    title: 'Acumulación de basura en esquina', 
    category: 'Basura', 
    date: '12/05/2024', 
    status: 'En Proceso',
    description: 'Gran cantidad de basura acumulada en la esquina, atrayendo roedores y generando malos olores.',
    photo: 'https://via.placeholder.com/400x300',
    location: 'Calle 5 y Av. Central'
  },
  { 
    id: 3, 
    title: 'Bache peligroso en Av. Principal', 
    category: 'Vialidad', 
    date: '03/05/2024', 
    status: 'Resuelto',
    description: 'Bache de gran tamaño que ocupa medio carril y representa un peligro para los vehículos.',
    photo: 'https://via.placeholder.com/400x300',
    location: 'Av. Principal #123'
  }
];

const statusClass = (s) => {
  if (s === 'Pendiente') return 'status pendiente';
  if (s === 'En Proceso') return 'status in-process';
  return 'status resolved';
};

const ReportDetails = ({ report, onClose }) => {
  if (!report) return null;

  return (
    <div className="report-details-overlay" onClick={onClose}>
      <div className="report-details-dialog" onClick={e => e.stopPropagation()}>
        <div className="report-details-header">
          <h2>{report.title}</h2>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>
        <div className="report-details-content">
          <div className="detail-group">
            <label>Estado</label>
            <p><span className={statusClass(report.status)}>{report.status}</span></p>
          </div>
          <div className="detail-group">
            <label>Categoría</label>
            <p>{report.category}</p>
          </div>
          <div className="detail-group">
            <label>Fecha de reporte</label>
            <p>{report.date}</p>
          </div>
          <div className="detail-group">
            <label>Descripción</label>
            <p>{report.description}</p>
          </div>
          <div className="detail-group">
            <label>Ubicación</label>
            <p>{report.location}</p>
            <div className="map-container">
              Mapa (aquí se integraría Mapbox/Leaflet)
            </div>
          </div>
          <div className="detail-group">
            <label>Foto</label>
            <img src={report.photo} alt={report.title} className="report-photo" />
          </div>
        </div>
      </div>
    </div>
  );
};

const MyReports = () => {
  const [selectedReport, setSelectedReport] = useState(null);

  return (
    <div className="myreports-page">
      <h1>Mis denuncias</h1>
      <div className="card">
        <h3>Listado de denuncias</h3>
        <div className="reports-list">
          {sampleReports.map(r => (
            <div key={r.id} className="report-row" onClick={() => setSelectedReport(r)} style={{ cursor: 'pointer' }}>
              <div className="report-info">
                <h4>{r.title}</h4>
                <p className="meta">{r.category} - Reportado el {r.date}</p>
              </div>
              <div className="report-actions">
                <span className={statusClass(r.status)}>{r.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      {selectedReport && (
        <ReportDetails 
          report={selectedReport} 
          onClose={() => setSelectedReport(null)} 
        />
      )}
    </div>
  );
};

export default MyReports;
