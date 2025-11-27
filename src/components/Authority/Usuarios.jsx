import React, { useState, useMemo } from 'react';
import AuthorityLayout from './AuthorityLayout';
import './Usuarios.css';

// Roles según entidades peruanas de tránsito
const ROLES_PERU = {
  'municipalidad': { label: 'Municipalidad', desc: 'Municipalidad Local', color: '#dc2626' },
  'diat': { label: 'DIAT', desc: 'Dirección de Infraestructura y Acciones de Tránsito', color: '#2563eb' },
  'fiscalia_transito': { label: 'Fiscalía de Tránsito', desc: 'Fiscalía Especializada en Tránsito', color: '#0891b2' },
  'pnp_transito': { label: 'PNP-Tránsito', desc: 'Policía Nacional - División Tránsito', color: '#7c3aed' },
  'denuncia': { label: 'Centro de Denuncias', desc: 'Recepción y gestión de reportes', color: '#059669' },
  'analista': { label: 'Analista', desc: 'Análisis de datos y reportes', color: '#f59e0b' },
};

const sampleUsers = [
  { id: 'U001', name: 'María López', email: 'maria.lopez@sutran.gob.pe', role: 'municipalidad', status: 'Activo', joined: '2023-05-12', phone: '+51 1 2345678', entity: 'Municipalidad' },
  { id: 'U002', name: 'Carlos Pérez', email: 'carlos.perez@pnp.gob.pe', role: 'fiscalia_transito', status: 'Activo', joined: '2022-11-02', phone: '+51 1 9876543', entity: 'Fiscalía de Tránsito' },
  { id: 'U003', name: 'Ana Torres', email: 'ana.torres@cusco.gob.pe', role: 'fiscalia_transito', status: 'Inactivo', joined: '2021-09-18', phone: '+51 84 123456', entity: 'Fiscalía de Tránsito' },
  { id: 'U004', name: 'Jorge Ramírez', email: 'jorge.ramirez@denuncias.gob.pe', role: 'denuncia', status: 'Activo', joined: '2024-01-08', phone: '+51 1 5551234', entity: 'Centro de Denuncias' },
  { id: 'U005', name: 'Lucía Méndez', email: 'lucia.mendez@admin.gob.pe', role: 'municipalidad', status: 'Activo', joined: '2020-03-22', phone: '+51 1 4445678', entity: 'Municipalidad' },
  { id: 'U006', name: 'Beatriz Gómez', email: 'beatriz.gomez@sutran.gob.pe', role: 'denuncia', status: 'Inactivo', joined: '2022-07-30', phone: '+51 1 3332222', entity: 'Centro de Denuncias' },
  { id: 'U007', name: 'Roberto Silva', email: 'roberto.silva@datos.gob.pe', role: 'analista', status: 'Activo', joined: '2023-02-14', phone: '+51 1 8889999', entity: 'Análisis' },
  { id: 'U008', name: 'Patricia Rojas', email: 'patricia.rojas@pnp.gob.pe', role: 'pnp_transito', status: 'Activo', joined: '2023-08-20', phone: '+51 1 7776666', entity: 'PNP-Tránsito' },
];

const Usuarios = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filtroRol, setFiltroRol] = useState('todos');
  const [filtroStatus, setFiltroStatus] = useState('todos');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'operador_denuncia',
    entity: ''
  });

  const filteredUsers = useMemo(() => {
    return sampleUsers.filter(u => {
      const matchQuery = !searchQuery || 
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.entity.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchRol = filtroRol === 'todos' || u.role === filtroRol;
      const matchStatus = filtroStatus === 'todos' || u.status === filtroStatus;
      
      return matchQuery && matchRol && matchStatus;
    });
  }, [searchQuery, filtroRol, filtroStatus]);

  const stats = useMemo(() => {
    const total = sampleUsers.length;
    const activos = sampleUsers.filter(u => u.status === 'Activo').length;
    const inactivos = total - activos;
    const porRol = {};
    sampleUsers.forEach(u => {
      porRol[u.role] = (porRol[u.role] || 0) + 1;
    });
    return { total, activos, inactivos, porRol };
  }, []);

  const handleOpenModal = (user = null) => {
    if (user) {
      setEditingUser(user);
      setNewUser({ ...user });
    } else {
      setEditingUser(null);
      setNewUser({
        name: '',
        email: '',
        phone: '',
        role: 'denuncia',
        entity: ''
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingUser(null);
  };

  const handleSaveUser = (e) => {
    e.preventDefault();
    console.log('Usuario guardado:', newUser);
    handleCloseModal();
  };

  const handleDeleteUser = (userId) => {
    if (confirm('¿Eliminar este usuario?')) {
      console.log('Usuario eliminado:', userId);
    }
  };

  return (
    <AuthorityLayout>
      <div className="authority-dashboard-container">
        <div className="usuarios-header">
          <div>
            <h1>Gestión de Usuarios</h1>
            <p className="subtitle">Administra usuarios de las entidades peruanas de tránsito</p>
          </div>
          <button className="btn btn-primary" onClick={() => handleOpenModal()}>+ Nuevo Usuario</button>
        </div>

        {/* Estadísticas */}
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-label">Total de Usuarios</div>
            <div className="stat-value">{stats.total}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Usuarios Activos</div>
            <div className="stat-value" style={{color:'#059669'}}>{stats.activos}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Usuarios Inactivos</div>
            <div className="stat-value" style={{color:'#dc2626'}}>{stats.inactivos}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Roles Distintos</div>
            <div className="stat-value">{Object.keys(stats.porRol).length}</div>
          </div>
        </div>

        {/* Filtros */}
        <div className="card">
          <div className="filters-row">
            <input 
              type="text"
              placeholder="Buscar por nombre, email o entidad..." 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <select value={filtroRol} onChange={(e) => setFiltroRol(e.target.value)} className="filter-select">
              <option value="todos">Todos los Roles</option>
              {Object.entries(ROLES_PERU).map(([key, { label }]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
            <select value={filtroStatus} onChange={(e) => setFiltroStatus(e.target.value)} className="filter-select">
              <option value="todos">Todos los Estados</option>
              <option value="Activo">Activos</option>
              <option value="Inactivo">Inactivos</option>
            </select>
          </div>

          {/* Tabla de usuarios */}
          <table className="users-table">
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Entidad</th>
                <th>Rol</th>
                <th>Contacto</th>
                <th>Estado</th>
                <th>Ingreso</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map(u => {
                  const roleInfo = ROLES_PERU[u.role];
                  return (
                    <tr key={u.id}>
                      <td>
                        <div className="user-cell">
                          <div className="user-avatar" style={{backgroundColor: roleInfo?.color || '#9ca3af'}}>
                            {u.name.split(' ').map(n=>n[0]).slice(0,2).join('')}
                          </div>
                          <div>
                            <div className="user-name">{u.name}</div>
                            <div className="user-email">{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="badge-entity">{u.entity}</span>
                      </td>
                      <td>
                        <span className="badge-role" style={{backgroundColor: roleInfo?.color + '20', color: roleInfo?.color, borderColor: roleInfo?.color}}>
                          {roleInfo?.label}
                        </span>
                      </td>
                      <td className="mono">{u.phone}</td>
                      <td>
                        <span className={`badge ${u.status === 'Activo' ? 'badge--active' : 'badge--inactive'}`}>
                          {u.status}
                        </span>
                      </td>
                      <td className="date-cell">{u.joined}</td>
                      <td className="actions-col">
                        <button className="btn btn-small btn-outline" onClick={() => handleOpenModal(u)}>Comunicarte</button>
                        <button className="btn btn-small btn-danger" onClick={() => handleDeleteUser(u.id)}>Eliminar</button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" style={{textAlign: 'center', padding: '24px', color: '#9ca3af'}}>
                    No hay usuarios que coincidan con los filtros
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div style={{marginTop: '16px', fontSize: '12px', color: '#6b7280'}}>
            Mostrando {filteredUsers.length} de {sampleUsers.length} usuarios
          </div>
        </div>

        {/* Modal Editar/Crear Usuario */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h2>{editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}</h2>
                <button className="modal-close" onClick={handleCloseModal}>✕</button>
              </div>
              <form onSubmit={handleSaveUser}>
                <div className="form-group">
                  <label>Nombre Completo *</label>
                  <input 
                    type="text" 
                    value={newUser.name} 
                    onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email *</label>
                  <input 
                    type="email" 
                    value={newUser.email} 
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Teléfono</label>
                  <input 
                    type="tel" 
                    value={newUser.phone} 
                    onChange={(e) => setNewUser({...newUser, phone: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Entidad *</label>
                  <input 
                    type="text" 
                    value={newUser.entity} 
                    onChange={(e) => setNewUser({...newUser, entity: e.target.value})}
                    placeholder="ej: SUTRAN, PNP-Tránsito, Municipalidad"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Rol *</label>
                  <select 
                    value={newUser.role} 
                    onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                  >
                    {Object.entries(ROLES_PERU).map(([key, { label }]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-outline" onClick={handleCloseModal}>Cancelar</button>
                  <button type="submit" className="btn btn-primary">Guardar</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AuthorityLayout>
  );
};

export default Usuarios;
