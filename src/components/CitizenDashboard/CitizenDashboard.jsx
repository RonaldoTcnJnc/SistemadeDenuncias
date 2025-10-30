import React from 'react';
import './CitizenDashboard.css';
import { FiCheckCircle, FiClock, FiAlertTriangle, FiPlus } from 'react-icons/fi';

// Datos de ejemplo
const notifications = [
    { id: 1, text: 'Tu denuncia "Bache peligroso en Av. Principal" ha sido resuelta.', time: 'Hace 2 horas', type: 'resolved' },
    { id: 2, text: 'La denuncia "Acumulación de basura en esquina" está ahora en proceso.', comment: 'Comentario: "Equipo de limpieza asignado. Se resolverá en 24-48 horas."', time: 'Hace 1 día', type: 'in_process' }
];

const reports = [
    { id: 1, title: 'Poste de luz caído', type: 'Alumbrado Público', date: '15/05/2024', description: 'Poste de luz caído en la acera, representa un peligro para los peatones.', status: 'Pendiente' },
    { id: 2, title: 'Acumulación de basura en esquina', type: 'Basura', date: '12/05/2024', description: 'Gran acumulación de bolsas de basura en la esquina de la Calle Falsa con la Av. Siempreviva.', update: 'Última actualización: "Equipo de limpieza asignado. Se resolverá en 24-48 horas."', status: 'En Proceso' },
    { id: 3, title: 'Bache peligroso en Av. Principal', type: 'Vialidad', date: '03/05/2024', description: 'Bache de gran tamaño que ha causado daños a varios vehículos.', resolution: 'El bache ha sido reparado por el equipo de vialidad el día 20/05/2024.', status: 'Resuelto' }
];

export default function CitizenDashboard() {
    return (
        <div className="citizen-dashboard-container">
            <h1>Panel del Ciudadano</h1>
            
            <section className="card notifications-section">
                <h3>Notificaciones Recientes</h3>
                {notifications.map(notif => (
                    <div key={notif.id} className={`notification-item ${notif.type}`}>
                        <div className="notification-icon">
                            {notif.type === 'resolved' && <FiCheckCircle />}
                            {notif.type === 'in_process' && <FiAlertTriangle />}
                        </div>
                        <div className="notification-content">
                            <p>{notif.text}</p>
                            {notif.comment && <small className="comment">{notif.comment}</small>}
                            <span className="time">{notif.time}</span>
                        </div>
                    </div>
                ))}
            </section>

            <section className="my-reports-section">
                <h2>Mis denuncias</h2>
                {reports.map(report => (
                    <div key={report.id} className="card report-card">
                        <div className="report-header">
                            <div>
                                <h4>{report.title}</h4>
                                <p className="report-meta">{report.type} - Reportado el {report.date}</p>
                            </div>
                            <span className={`status-tag ${report.status.toLowerCase().replace(' ', '-')}`}>{report.status}</span>
                        </div>
                        <p className="report-description">{report.description}</p>
                        {report.update && <div className="report-update">{report.update}</div>}
                        {report.resolution && <div className="report-resolution">{report.resolution}</div>}
                    </div>
                ))}
            </section>

            <button className="btn-create-new">
                <FiPlus /> Crear nueva denuncia
            </button>
        </div>
    );
}