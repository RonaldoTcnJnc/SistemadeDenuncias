import React, { useState, useRef } from 'react';
import './ProfilePage.css';
import { FiEdit2, FiUser } from 'react-icons/fi';
import userAvatar from '../../assets/userAvatar.svg';

const ProfilePage = () => {
    const [profileImage, setProfileImage] = useState(null);
    const fileInputRef = useRef(null);

    const handleImageClick = () => {
        fileInputRef.current.click();
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file && file.size <= 5 * 1024 * 1024) { // 5MB max
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImage(reader.result);
            };
            reader.readAsDataURL(file);
        } else if (file) {
            alert('La imagen debe ser menor a 5MB');
        }
    };

    return (
        <div className="profile-page-container">
            <h1>Mi Perfil</h1>

            <div className="card">
                <h3>Información Personal</h3>
                <div className="personal-info-form">
                    <div className="profile-picture-section">
                        <div className="profile-image-container" onClick={handleImageClick}>
                            {profileImage ? (
                                <img src={profileImage} alt="Foto de perfil" className="profile-image" />
                            ) : (
                                <FiUser size={52} color="#9CA3AF" />
                            )}
                            <button className="btn-edit-pic" title="Cambiar foto de perfil">
                                <FiEdit2 size={18} />
                            </button>
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageChange}
                            accept="image/png, image/jpeg"
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