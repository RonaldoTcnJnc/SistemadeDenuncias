import React from 'react';
import AuthorityLayout from './AuthorityLayout';
import './Usuarios.css';

const sampleUsers = [
  { id: 'U001', name: 'María López', email: 'maria.lopez@municipio.example', role: 'Operador', status: 'Activo', joined: '2023-05-12' },
  { id: 'U002', name: 'Carlos Pérez', email: 'carlos.perez@municipio.example', role: 'Supervisor', status: 'Activo', joined: '2022-11-02' },
  { id: 'U003', name: 'Ana Torres', email: 'ana.torres@municipio.example', role: 'Analista', status: 'Inactivo', joined: '2021-09-18' },
  { id: 'U004', name: 'Jorge Ramírez', email: 'jorge.ramirez@municipio.example', role: 'Técnico', status: 'Activo', joined: '2024-01-08' },
  { id: 'U005', name: 'Lucía Méndez', email: 'lucia.mendez@municipio.example', role: 'Administrador', status: 'Activo', joined: '2020-03-22' },
  { id: 'U006', name: 'Beatriz Gómez', email: 'beatriz.gomez@municipio.example', role: 'Operador', status: 'Inactivo', joined: '2022-07-30' },
];

const Usuarios = () => {
  return (
    <AuthorityLayout>
      <div className="authority-dashboard-container">
        <h1>Usuarios</h1>
        <p className="subtitle">Lista de usuarios de ejemplo. Aquí puedes ver estado, rol y acciones rápidas.</p>

        <div className="card">
          <table className="users-table">
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Rol</th>
                <th>Estado</th>
                <th>Fecha de ingreso</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {sampleUsers.map(u => (
                <tr key={u.id}>
                  <td>
                    <div className="user-cell">
                      <div className="user-avatar">{u.name.split(' ').map(n=>n[0]).slice(0,2).join('')}</div>
                      <div>
                        <div className="user-name">{u.name}</div>
                        <div className="user-email">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>{u.role}</td>
                  <td><span className={`badge ${u.status === 'Activo' ? 'badge--active' : 'badge--inactive'}`}>{u.status}</span></td>
                  <td>{u.joined}</td>
                  <td className="actions-col">
                    <button className="btn btn-outline">Ver</button>
                    <button className="btn btn-ghost">Editar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AuthorityLayout>
  );
};

export default Usuarios;
