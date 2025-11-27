import React from 'react';
import './CitizenDashboard.css';
import { FiCheckCircle, FiClock, FiBell, FiPlus } from 'react-icons/fi';

// Datos de ejemplo para notificaciones — reemplazar por datos reales desde API/backend
const notifications = [
  { id: 1, text: 'Tu denuncia "Bache peligroso en Av. Principal" ha sido resuelta.', time: 'Hace 2 horas', type: 'resolved' },
  { id: 2, text: 'La denuncia "Acumulación de basura en esquina" está ahora en proceso.', comment: 'Equipo de limpieza asignado. Se resolverá en 24-48 horas.', time: 'Hace 1 día', type: 'in_process' }
];

// Datos de ejemplo para reportes — reemplazar por datos reales desde API/backend
const reports = [
  { id: 1, title: 'Poste de luz caído', type: 'Alumbrado Público', date: '15/05/2024', description: 'Poste de luz caído en la acera, representa un peligro para los peatones.', status: 'Pendiente' },
  { id: 2, title: 'Acumulación de basura en esquina', type: 'Basura', date: '12/05/2024', description: 'Gran acumulación de bolsas de basura en la esquina de la Calle Falsa con la Av. Siempreviva.', update: 'Última actualización: Equipo de limpieza asignado (24-48h).', status: 'En Proceso' },
  { id: 3, title: 'Bache peligroso en Av. Principal', type: 'Vialidad', date: '03/05/2024', description: 'Bache de gran tamaño que ha causado daños a varios vehículos.', resolution: 'Reparado por el equipo de vialidad el 20/05/2024.', status: 'Resuelto' }
];

export default function CitizenDashboard() {
  // Calcular totales por estado (resueltas, en proceso, pendientes)
  const totals = reports.reduce(
    (acc, r) => {
      const s = r.status?.toLowerCase();
      if (s.includes('resuelto')) acc.resolved++;
      else if (s.includes('en proceso') || s.includes('en-proceso')) acc.inProcess++;
      else acc.pending++;
      return acc;
    },
    { resolved: 0, inProcess: 0, pending: 0 }
  );

  // Contador de notificaciones sin leer (simulado con el largo del array)
  const unreadCount = notifications.length; // badge en header

  return (
    <div className="citizen-dashboard-container">
      {/* Header principal: título, subtítulo y estadísticas principales */}
      <div className="dashboard-header">
        <h1 className="dashboard-title">PANEL DEL CIUDADANO</h1>
        <p className="dashboard-subtitle">Gestiona tus denuncias, seguimiento y notificaciones</p>

        {/* Estadísticas rápidas */}
        <div className="dashboard-stats">
          <div className="stat-card stat-resolved">
            <FiCheckCircle /> <div className="stat-value">{totals.resolved}</div>
            <div className="stat-label">Resueltas</div>
          </div>
          <div className="stat-card stat-inprocess">
            <FiClock /> <div className="stat-value">{totals.inProcess}</div>
            <div className="stat-label">En proceso</div>
          </div>
          <div className="stat-card stat-pending">
            <FiBell /> <div className="stat-value">{totals.pending}</div>
            <div className="stat-label">Pendientes</div>
          </div>
        </div>
      </div>

      {/* Sección de notificaciones: lista compacta y badge */}
      <section className="notifications-section card">
        <h3 className="notifications-title">
          <span className="title-text">Notificaciones</span>
          {/* Badge de notificaciones sin leer */}
          <span className="notif-badge" aria-hidden="true">{unreadCount}</span>
          <FiBell className="notif-header-icon" />
        </h3>

        {/* Lista de notificaciones — iterar y renderizar cada item */}
        <div className="notifications-list">
          {notifications.map((notif) => (
            <div key={notif.id} className={`notification-item ${notif.type}`}>
              <div className="notification-icon">
                {/* Icono según tipo de notificación */}
                {notif.type === 'resolved' && <FiCheckCircle />}
                {notif.type === 'in_process' && <FiBell />}
              </div>
              <div className="notification-content">
                <p className="notification-text">{notif.text}</p>
                {/* Comentario adicional si existe */}
                {notif.comment && <small className="notification-comment">{notif.comment}</small>}
                <span className="notification-time">{notif.time}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Sección de reportes: grid con tarjetas por cada denuncia */}
      <section className="my-reports-section">
        <h2>Mis denuncias</h2>
        <div className="reports-grid">
          {reports.map((report) => {
            // Clase de estado para estilos (ej: 'resuelto', 'en-proceso', 'pendiente')
            const statusClass = report.status.toLowerCase().replace(' ', '-');
            return (
              <div key={report.id} className={`card report-card ${statusClass}`}>
                <div className="report-header">
                  <div className="report-left">
                    <h4 className="report-title">{report.title}</h4>
                    <p className="report-meta">{report.type} · {report.date}</p>
                  </div>
                  {/* Etiqueta de estado visible en la tarjeta */}
                  <span className={`status-tag ${statusClass}`}>{report.status}</span>
                </div>

                {/* Descripción y actualizaciones */}
                <p className="report-description">{report.description}</p>

                {/* Mostrar actualización o resolución si existe */}
                {report.update && <div className="report-update">{report.update}</div>}
                {report.resolution && <div className="report-resolution">{report.resolution}</div>}
              </div>
            );
          })}
        </div>
      </section>

      {/* Botón flotante para crear nueva denuncia — enlazar a formulario correspondiente */}
      <button className="btn-create-new" aria-label="Crear nueva denuncia">
        <FiPlus />
      </button>
    </div>
  );
}