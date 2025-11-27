import React, { useState, useRef } from 'react';
import './ProfilePage.css';
// Importa la imagen de perfil por defecto (coloca Miperfil.png en src/assets/)
import profileDefault from '../../assets/Miperfil.png';

// Componente: Página de Perfil — mantén la lógica de subida y validación
const ProfilePage = () => {
  // Estado para mostrar la imagen actual del usuario (URL base64 o import)
  const [profileImage, setProfileImage] = useState(profileDefault);
  const fileInputRef = useRef(null);

  // Al hacer click en el lápiz: abrir selector de archivos
  const handleEditPicClick = () => {
    fileInputRef.current?.click();
  };

  // Validación y lectura del archivo seleccionado
  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Tipos permitidos: PNG, JPG, JPEG, WebP (si usas webp en el sitio)
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5 MB

    if (!validTypes.includes(file.type)) {
      alert('Selecciona un archivo PNG, JPG o WebP.');
      return;
    }

    if (file.size > maxSize) {
      alert('El archivo es demasiado grande. Máx 5MB.');
      return;
    }

    // Mostrar vista previa local (URL base64)
    const reader = new FileReader();
    reader.onload = (e) => {
      setProfileImage(e.target?.result);
    };
    reader.readAsDataURL(file);

    // NOTA: aquí podrías además subir a tu servidor / CDN si lo deseas
  };

  return (
    <div className="profile-page-wrapper">
      {/* Header con título y avatar al lado */}
      <div className="profile-header card">
        <div className="profile-header-left">
          {/* Título y subtítulo */}
          <h1 className="profile-title">Mi Perfil</h1>
          <p className="profile-subtitle">Gestiona tu información y preferencias</p>
        </div>

        {/* Avatar visible al lado del título con botón para editar (mantener funcionalidad) */}
        <div className="profile-header-right">
          <div className="avatar-wrapper">
            <img src={profileImage} alt="Foto de perfil" className="avatar-img" />
            <button className="btn-edit-pic" aria-label="Cambiar foto" onClick={handleEditPicClick}>
              ✏️
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
          </div>
        </div>
      </div>

      {/* Card: Información personal con diseño más profesional */}
      <div className="card">
        <h3>Información Personal</h3>
        <div className="personal-info-form">
          <div className="info-fields">
            <div className="form-group">
              <label>Nombre Completo</label>
              <input type="text" defaultValue="Juan Pérez García" />
            </div>
            <div className="form-group">
              <label>Correo Electrónico</label>
              <input type="email" defaultValue="juan.perez@example.com" readOnly />
            </div>
            <div className="form-actions-row">
              <button className="btn btn-primary">Guardar cambios</button>
            </div>
          </div>
        </div>
      </div>

      {/* Card: Cambiar contraseña */}
      <div className="card">
        <h3>Cambiar Contraseña</h3>
        <div className="password-form">
          <div className="form-group">
            <label>Contraseña actual</label>
            <input type="password" />
          </div>
          <div className="form-group-inline">
            <div className="form-group">
              <label>Nueva contraseña</label>
              <input type="password" />
            </div>
            <div className="form-group">
              <label>Confirmar nueva contraseña</label>
              <input type="password" />
            </div>
          </div>
          <div className="form-actions-row">
            <button className="btn btn-primary">Actualizar contraseña</button>
          </div>
        </div>
      </div>

      {/* Card: Preferencias con switches estilizados */}
      <div className="card">
        <h3>Preferencias de Notificación</h3>
        <div className="notification-prefs">
          <div className="pref-item">
            <div>
              <strong>Notificaciones por correo</strong>
              <p>Recibe un email cuando el estado de tu denuncia cambie.</p>
            </div>
            <label className="switch">
              <input type="checkbox" defaultChecked />
              <span className="slider round"></span>
            </label>
          </div>

          <div className="pref-item">
            <div>
              <strong>Notificaciones push</strong>
              <p>Recibe notificaciones en tu navegador sobre tus denuncias.</p>
            </div>
            <label className="switch">
              <input type="checkbox" />
              <span className="slider round"></span>
            </label>
          </div>

          <div className="pref-item">
            <div>
              <strong>Boletín informativo</strong>
              <p>Recibe noticias y actualizaciones de la plataforma.</p>
            </div>
            <label className="switch">
              <input type="checkbox" defaultChecked />
              <span className="slider round"></span>
            </label>
          </div>
          <div className="form-actions-row">
            <button className="btn btn-primary">Guardar preferencias</button>
          </div>
        </div>
      </div>

      {/* Zona de peligro: eliminar cuenta */}
      <div className="card danger-zone">
        <h3>Zona de Peligro</h3>
        <div className="danger-content">
          <p>Estas acciones son permanentes y no se pueden deshacer.</p>
          <div>
            <strong>Eliminar mi cuenta</strong>
            <p>Se borrarán todas tus denuncias y datos personales.</p>
          </div>
          <button className="btn btn-danger">Eliminar cuenta</button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;