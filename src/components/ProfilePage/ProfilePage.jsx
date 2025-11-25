import React, { useState, useRef } from 'react';
import './ProfilePage.css';
// Placeholder para imagen de perfil (usar svg existente)
import profilePlaceholder from '../../assets/react.svg'; 

const ProfilePage = () => {
    const [profileImage, setProfileImage] = useState(profilePlaceholder);
    const fileInputRef = useRef(null);

    const handleEditPicClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event) => {
        const file = event.target.files?.[0];
        if (file) {
            // Validar que sea una imagen PNG o JPG
            const validTypes = ['image/png', 'image/jpeg'];
            const maxSize = 5 * 1024 * 1024; // 5MB en bytes

            if (!validTypes.includes(file.type)) {
                alert('Por favor, selecciona un archivo PNG o JPG.');
                return;
            }

            if (file.size > maxSize) {
                alert('El archivo es demasiado grande. El tamaño máximo es 5MB.');
                return;
            }

            // Crear una URL temporal para mostrar la imagen
            const reader = new FileReader();
            reader.onload = (e) => {
                setProfileImage(e.target?.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="profile-page-container">
            <h1>Mi Perfil</h1>

            <div className="card">
                <h3>Información Personal</h3>
                <div className="personal-info-form">
                    <div className="profile-picture-section">
                        <img src={profileImage} alt="Foto de perfil" />
                        <button className="btn-edit-pic" onClick={handleEditPicClick}>✏️</button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/png,image/jpeg"
                            onChange={handleFileChange}
                            style={{ display: 'none' }}
                        />
                        <p>Haz clic en el lápiz para cambiar tu foto de perfil. <br/> PNG o JPG. Máximo 5MB.</p>
                    </div>
                    <div className="info-fields">
                        <div className="form-group">
                            <label>Nombre Completo</label>
                            <input type="text" defaultValue="Juan Pérez García" />
                        </div>
                        <div className="form-group">
                            <label>Correo Electrónico</label>
                            <input type="email" defaultValue="juan.perez@example.com" readOnly />
                        </div>
                        <button className="btn-save">Guardar cambios</button>
                    </div>
                </div>
            </div>

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
                    <button className="btn-save">Actualizar contraseña</button>
                </div>
            </div>

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
                    <button className="btn-save">Guardar preferencias</button>
                </div>
            </div>

            <div className="card danger-zone">
                <h3>Zona de Peligro</h3>
                <div className="danger-content">
                    <p>Estas acciones son permanentes y no se pueden deshacer.</p>
                    <div>
                        <strong>Eliminar mi cuenta</strong>
                        <p>Se borrarán todas tus denuncias y datos personales.</p>
                    </div>
                    <button className="btn-danger">Eliminar cuenta</button>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;