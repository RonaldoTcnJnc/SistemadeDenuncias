import React, { useState } from 'react';
import AuthorityLayout from './AuthorityLayout';
import { FiLock, FiShield, FiClock, FiChevronRight, FiCamera, FiX } from 'react-icons/fi'
import { useProfile } from '../../contexts/ProfileContext';
import './AuthorityDashboard.css'

const PerfilAuthority = () => {
  const { profile: globalProfile, updateProfile } = useProfile();
  const [profile, setProfile] = useState(globalProfile);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editForm, setEditForm] = useState(profile);
  const [activeModal, setActiveModal] = useState(null);
  const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' });
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [activityLog, setActivityLog] = useState([
    { id: 1, action: 'Inicio de sesión', timestamp: '2025-11-27 14:30', device: 'Chrome - Windows' },
    { id: 2, action: 'Cambio de configuración', timestamp: '2025-11-27 13:15', device: 'Safari - iPhone' },
    { id: 3, action: 'Descarga de reporte', timestamp: '2025-11-27 10:45', device: 'Chrome - Windows' },
    { id: 4, action: 'Inicio de sesión', timestamp: '2025-11-26 09:20', device: 'Firefox - Linux' },
  ]);

  const handleEditProfile = () => {
    setEditForm(profile);
    setIsEditingProfile(true);
  };

  const handleSaveProfile = () => {
    setProfile(editForm);
    updateProfile(editForm);
    setIsEditingProfile(false);
  };

  const handleCancelEdit = () => {
    setEditForm(profile);
    setIsEditingProfile(false);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditForm(prev => ({
          ...prev,
          avatarImage: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChangePassword = () => {
    if (passwordForm.new === passwordForm.confirm && passwordForm.new.length >= 8) {
      console.log('Contraseña cambiada:', passwordForm);
      alert('Contraseña cambiada exitosamente');
      setPasswordForm({ current: '', new: '', confirm: '' });
      setActiveModal(null);
    } else {
      alert('Las contraseñas no coinciden o son muy cortas (mín 8 caracteres)');
    }
  };

  const handleEnableTwoFactor = () => {
    console.log('2FA habilitado');
    alert('Se ha enviado un código a tu correo. Verifica para completar la activación.');
    setTwoFactorEnabled(true);
    setActiveModal(null);
  };

  const handleDisableTwoFactor = () => {
    console.log('2FA deshabilitado');
    setTwoFactorEnabled(false);
    setActiveModal(null);
  };

  const displayName = isEditingProfile ? editForm.name : profile.name;
  const displayAvatar = isEditingProfile && editForm.avatarImage ? 
    <img src={editForm.avatarImage} alt="Avatar" style={{width: '100%', height: '100%', objectFit: 'cover'}} /> :
    (profile.avatarImage ? 
      <img src={profile.avatarImage} alt="Avatar" style={{width: '100%', height: '100%', objectFit: 'cover'}} /> :
      profile.avatar);

  return (
    <AuthorityLayout>
      <div className="authority-dashboard-container">
        <div className="authority-grid">
          <div className="main-column">
            {/* Tarjeta de Perfil */}
            <div className="card profile-card">
              <div className="profile-edit-header">
                <button 
                  className="btn btn-small btn-outline"
                  onClick={isEditingProfile ? handleCancelEdit : handleEditProfile}
                  style={{marginLeft: 'auto'}}
                >
                  {isEditingProfile ? '✕ Cancelar' : 'Editar'}
                </button>
              </div>

              {!isEditingProfile ? (
                <div className="profile-row">
                  <div className="profile-avatar" style={{overflow: 'hidden'}}>
                    {displayAvatar}
                  </div>
                  <div>
                    <h2>{displayName}</h2>
                    <div className="muted">{profile.role}</div>
                    <div className="muted">{profile.district}</div>
                    <p className="profile-bio">{profile.bio}</p>
                    <div style={{fontSize: '13px', color: '#6b7280', marginTop: '8px'}}>
                      📧 {profile.email} | 📱 {profile.phone}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="edit-profile-form">
                  <div className="form-group">
                    <label>Foto de Perfil</label>
                    <div className="avatar-upload">
                      <div className="profile-avatar" style={{overflow: 'hidden', marginBottom: '12px'}}>
                        {displayAvatar}
                      </div>
                      <label className="btn btn-small btn-outline" style={{cursor: 'pointer', marginBottom: '12px'}}>
                        <FiCamera style={{marginRight: '4px'}} /> Cambiar Foto
                        <input type="file" accept="image/*" onChange={handleAvatarChange} style={{display: 'none'}} />
                      </label>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Nombre Completo</label>
                    <input 
                      type="text" 
                      value={editForm.name}
                      onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                      style={{width: '100%', padding: '10px', border: '1px solid #e5e7eb', borderRadius: '8px'}}
                    />
                  </div>

                  <div className="form-group">
                    <label>Biografía</label>
                    <textarea 
                      value={editForm.bio}
                      onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                      rows={3}
                      style={{width: '100%', padding: '10px', border: '1px solid #e5e7eb', borderRadius: '8px', fontFamily: 'inherit'}}
                    />
                  </div>

                  <div style={{display: 'flex', gap: '12px', marginTop: '20px'}}>
                    <button className="btn btn-primary" onClick={handleSaveProfile}>
                      Guardar Cambios
                    </button>
                    <button className="btn btn-outline" onClick={handleCancelEdit}>
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Configuración del Área */}
            <div className="card area-card">
              <h3>Configuración del Área</h3>
              <label>Distrito asignado</label>
              <select style={{padding: '10px', border: '1px solid #e5e7eb', borderRadius: '8px', width: '100%'}}>
                <option>Distrito Norte</option>
                <option>Distrito Sur</option>
                <option>Distrito Este</option>
                <option>Distrito Oeste</option>
              </select>
            </div>
          </div>

          {/* Sidebar de Seguridad */}
          <aside className="side-column">
            <div className="card security-card">
              <h3>Seguridad</h3>
              
              <button 
                className="security-item-btn"
                onClick={() => setActiveModal('password')}
              >
                <div className="label"><span className="icon icon-blue"><FiLock /></span> <span>Cambiar contraseña</span></div>
                <FiChevronRight />
              </button>

              <button 
                className="security-item-btn"
                onClick={() => setActiveModal('2fa')}
              >
                <div className="label"><span className="icon icon-green"><FiShield /></span> <span>Autenticación de dos factores</span></div>
                <FiChevronRight />
              </button>

              <button 
                className="security-item-btn"
                onClick={() => setActiveModal('activity')}
              >
                <div className="label"><span className="icon icon-gray"><FiClock /></span> <span>Actividad de la cuenta</span></div>
                <FiChevronRight />
              </button>
            </div>
          </aside>
        </div>

        {/* Modal Cambiar Contraseña */}
        {activeModal === 'password' && (
          <div className="modal-overlay" onClick={() => setActiveModal(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Cambiar Contraseña</h2>
                <button className="modal-close" onClick={() => setActiveModal(null)}>✕</button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label>Contraseña Actual *</label>
                  <input 
                    type="password" 
                    value={passwordForm.current}
                    onChange={(e) => setPasswordForm({...passwordForm, current: e.target.value})}
                    placeholder="Ingresa tu contraseña actual"
                  />
                </div>
                <div className="form-group">
                  <label>Nueva Contraseña *</label>
                  <input 
                    type="password" 
                    value={passwordForm.new}
                    onChange={(e) => setPasswordForm({...passwordForm, new: e.target.value})}
                    placeholder="Mínimo 8 caracteres"
                  />
                </div>
                <div className="form-group">
                  <label>Confirmar Nueva Contraseña *</label>
                  <input 
                    type="password" 
                    value={passwordForm.confirm}
                    onChange={(e) => setPasswordForm({...passwordForm, confirm: e.target.value})}
                    placeholder="Confirma tu nueva contraseña"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-outline" onClick={() => setActiveModal(null)}>Cancelar</button>
                <button className="btn btn-primary" onClick={handleChangePassword}>Cambiar Contraseña</button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Autenticación 2FA */}
        {activeModal === '2fa' && (
          <div className="modal-overlay" onClick={() => setActiveModal(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Autenticación de Dos Factores</h2>
                <button className="modal-close" onClick={() => setActiveModal(null)}>✕</button>
              </div>
              <div className="modal-body">
                <div style={{textAlign: 'center', padding: '20px'}}>
                  <div style={{fontSize: '48px', marginBottom: '16px'}}>🔐</div>
                  <p>Estado actual: <strong style={{color: twoFactorEnabled ? '#059669' : '#dc2626'}}>
                    {twoFactorEnabled ? '✓ Habilitado' : '✗ Deshabilitado'}
                  </strong></p>
                  <p style={{fontSize: '13px', color: '#6b7280', marginTop: '12px'}}>
                    La autenticación de dos factores añade una capa adicional de seguridad a tu cuenta.
                  </p>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-outline" onClick={() => setActiveModal(null)}>Cerrar</button>
                {!twoFactorEnabled ? (
                  <button className="btn btn-primary" onClick={handleEnableTwoFactor}>Habilitar 2FA</button>
                ) : (
                  <button className="btn btn-danger" onClick={handleDisableTwoFactor}>Deshabilitar 2FA</button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Modal Actividad de la Cuenta */}
        {activeModal === 'activity' && (
          <div className="modal-overlay" onClick={() => setActiveModal(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{maxWidth: '600px'}}>
              <div className="modal-header">
                <h2>Actividad de la Cuenta</h2>
                <button className="modal-close" onClick={() => setActiveModal(null)}>✕</button>
              </div>
              <div className="modal-body" style={{maxHeight: '400px', overflowY: 'auto'}}>
                <div style={{padding: '0'}}>
                  {activityLog.map((activity, idx) => (
                    <div key={activity.id} style={{
                      padding: '16px',
                      borderBottom: idx < activityLog.length - 1 ? '1px solid #e5e7eb' : 'none',
                      display: 'flex',
                      gap: '12px'
                    }}>
                      <div style={{fontSize: '20px'}}>📍</div>
                      <div style={{flex: 1}}>
                        <div style={{fontWeight: '600', color: '#1f2937'}}>{activity.action}</div>
                        <div style={{fontSize: '12px', color: '#6b7280', marginTop: '4px'}}>
                          {activity.timestamp} • {activity.device}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-outline" onClick={() => setActiveModal(null)}>Cerrar</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AuthorityLayout>
  );
};

export default PerfilAuthority;
