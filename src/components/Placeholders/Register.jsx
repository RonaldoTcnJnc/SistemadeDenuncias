import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Register.css';
// Importa íconos
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';
import { FiLoader } from 'react-icons/fi';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    dni: '',
    fullName: '',
    email: '',
    phone: '',
    address: '',
    fechaNacimiento: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });
  const [termsRead, setTermsRead] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loadingDNI, setLoadingDNI] = useState(false);
  const [dniError, setDniError] = useState('');
  const debounceTimer = useRef(null);

  // Función para consultar la API de DNI
  const consultarDNI = async (dni) => {
    if (!dni || dni.length !== 8) {
      return;
    }

    setLoadingDNI(true);
    setDniError('');

    try {
      console.log('🔍 Consultando DNI:', dni);
      const response = await fetch(`/api/auth/consultar-dni?dni=${dni}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });

      console.log('📡 Respuesta HTTP:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      });

      if (!response.ok) {
        let errorText = await response.text();
        try {
          const errorJson = JSON.parse(errorText);
          errorText = errorJson.message || errorJson.error || errorText;
        } catch (e) {
          // Keep as text
        }
        console.error('❌ Error de respuesta:', errorText);
        throw new Error(`Error ${response.status}: ${errorText || response.statusText}`);
      }

      const data = await response.json();
      console.log('📦 Datos completos recibidos:', JSON.stringify(data, null, 2));
      console.log('🔑 Claves disponibles:', Object.keys(data || {}));

      // EXTRACCIÓN DEL NOMBRE COMPLETO - ORDEN DE PRIORIDAD
      let nombreCompleto = '';
      let direccion = '';
      let fechaNacimiento = '';

      // PRIORIDAD 1: fullName directo (tu API lo devuelve así)
      if (data.fullName) {
        nombreCompleto = data.fullName.trim();
        console.log('✅ Nombre encontrado en fullName:', nombreCompleto);
      }
      // PRIORIDAD 2: Construir desde names y surnames (tu API también lo tiene)
      else if (data.names && data.surnames) {
        nombreCompleto = `${data.names} ${data.surnames}`.trim();
        console.log('✅ Nombre construido desde names + surnames:', nombreCompleto);
      }
      // PRIORIDAD 3: nombre_completo o nombreCompleto
      else if (data.nombre_completo || data.nombreCompleto) {
        nombreCompleto = (data.nombre_completo || data.nombreCompleto).trim();
        console.log('✅ Nombre encontrado en nombre_completo/nombreCompleto:', nombreCompleto);
      }
      // PRIORIDAD 4: Estructura con nombres, apellidoPaterno, apellidoMaterno
      else if (data.nombres) {
        const nombres = data.nombres || '';
        const apellidoPaterno = data.apellidoPaterno || data.apellido_paterno || data.paternalLastName || '';
        const apellidoMaterno = data.apellidoMaterno || data.apellido_materno || data.maternalLastName || '';
        nombreCompleto = `${nombres} ${apellidoPaterno} ${apellidoMaterno}`.trim();
        console.log('✅ Nombre construido desde nombres + apellidos:', nombreCompleto);
      }
      // PRIORIDAD 5: Datos anidados en data
      else if (data.data) {
        const d = data.data;
        if (d.fullName) {
          nombreCompleto = d.fullName.trim();
        } else if (d.names && d.surnames) {
          nombreCompleto = `${d.names} ${d.surnames}`.trim();
        } else if (d.nombres) {
          const nombres = d.nombres || '';
          const apellidoPaterno = d.apellidoPaterno || d.apellido_paterno || '';
          const apellidoMaterno = d.apellidoMaterno || d.apellido_materno || '';
          nombreCompleto = `${nombres} ${apellidoPaterno} ${apellidoMaterno}`.trim();
        }
        console.log('✅ Nombre extraído de data anidado:', nombreCompleto);
      }
      // PRIORIDAD 6: nombre simple
      else if (data.nombre) {
        nombreCompleto = data.nombre.trim();
        console.log('✅ Nombre encontrado en campo nombre:', nombreCompleto);
      }

      // Extraer dirección
      direccion = data.direccion || data.domicilio || data.direccionCompleta || data.address || '';
      
      // Extraer fecha de nacimiento
      fechaNacimiento = data.fechaNacimiento || data.fecha_nacimiento || data.birthDate || '';

      // Convertir fecha de nacimiento al formato correcto (YYYY-MM-DD)
      if (fechaNacimiento) {
        const fecha = String(fechaNacimiento);
        if (fecha.includes('/')) {
          const parts = fecha.split('/');
          if (parts.length === 3) {
            const [dia, mes, anio] = parts;
            fechaNacimiento = `${anio}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
          }
        } else if (fecha.includes('-') && fecha.length === 10) {
          // Ya está en formato YYYY-MM-DD
          fechaNacimiento = fecha;
        }
      }

      console.log('📝 Datos finales extraídos:', {
        nombreCompleto,
        direccion,
        fechaNacimiento
      });

      // Validar que se obtuvo el nombre
      if (nombreCompleto && nombreCompleto.trim()) {
        setFormData(prev => ({
          ...prev,
          fullName: nombreCompleto.trim(),
          address: direccion || prev.address,
          fechaNacimiento: fechaNacimiento || prev.fechaNacimiento
        }));
        setDniError('');
        console.log('✅ Datos autocompletados exitosamente');
        
        // Mostrar mensaje de éxito temporal
        setTimeout(() => {
          console.log('✅ Formulario actualizado con:', {
            fullName: nombreCompleto.trim(),
            address: direccion,
            fechaNacimiento: fechaNacimiento
          });
        }, 100);
      } else {
        console.warn('⚠️ No se pudo extraer el nombre completo de la respuesta');
        console.warn('⚠️ Estructura de datos recibida:', data);
        throw new Error('No se pudo obtener el nombre desde la API. Por favor, completa manualmente.');
      }

    } catch (error) {
      console.error('❌ Error completo al consultar DNI:', {
        message: error.message,
        stack: error.stack,
        dni: dni
      });
      setDniError(`No se pudo obtener la información del DNI. ${error.message}`);
      
      // Permitir que el usuario continúe manualmente
      setFormData(prev => ({
        ...prev,
        fullName: '',
        address: prev.address,
        fechaNacimiento: prev.fechaNacimiento
      }));
    } finally {
      setLoadingDNI(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Limpiar error del campo cuando empieza a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Si se está escribiendo el DNI, consultar la API con debounce
    if (name === 'dni') {
      setDniError('');
      
      // Limpiar timer anterior
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      // Esperar 800ms después de que el usuario deje de escribir
      debounceTimer.current = setTimeout(() => {
        if (value.length === 8 && /^\d+$/.test(value)) {
          consultarDNI(value);
        } else if (value.length > 0 && value.length !== 8) {
          setDniError('El DNI debe tener 8 dígitos');
        }
      }, 800);
    }
  };

  // Limpiar timer al desmontar el componente
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.dni.trim()) {
      newErrors.dni = 'El DNI es requerido';
    } else if (formData.dni.length !== 8 || !/^\d+$/.test(formData.dni)) {
      newErrors.dni = 'El DNI debe tener 8 dígitos numéricos';
    }

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'El nombre completo es requerido';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El correo electrónico es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Correo electrónico inválido';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'El teléfono es requerido';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'La dirección es requerida';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    if (!termsRead) {
      newErrors.termsRead = 'Debes leer los términos y condiciones antes de aceptarlos';
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'Debes aceptar los términos y condiciones';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length === 0) {
      try {
        // Preparar datos para enviar al backend
        const registroData = {
          dni: formData.dni,
          nombre_completo: formData.fullName,
          email: formData.email,
          telefono: formData.phone,
          direccion: formData.address,
          fecha_nacimiento: formData.fechaNacimiento || null,
          password: formData.password
        };

        // Intentar registrar en el backend
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(registroData)
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Error al crear la cuenta');
        }

        setSubmitted(true);
        setTimeout(() => {
          navigate('/iniciar-sesion');
        }, 2000);
      } catch (error) {
        console.error('Error al registrar:', error);
        setErrors({ submit: error.message || 'Error al crear la cuenta. Por favor intenta de nuevo.' });
      }
    } else {
      setErrors(newErrors);
    }
  };

  if (submitted) {
    return (
      <div className="register-page-container">
        <div className="register-form-box">
          <div className="success-message">
            <h2>✓ Cuenta creada exitosamente</h2>
            <p>Tu cuenta ha sido registrada. Redirigiendo a inicio de sesión...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="register-page-container">
      <div className="register-form-box">
        <h2>Crear cuenta</h2>
        <p>Únete a nuestra plataforma de denuncias ciudadanas.</p>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="dni">DNI *</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                id="dni"
                name="dni"
                placeholder="12345678"
                value={formData.dni}
                onChange={handleChange}
                maxLength="8"
                style={{ paddingRight: loadingDNI ? '40px' : '12px' }}
              />
              {loadingDNI && (
                <FiLoader 
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    animation: 'spin 1s linear infinite'
                  }}
                />
              )}
            </div>
            {errors.dni && <span className="error-message">{errors.dni}</span>}
            {dniError && <span className="error-message" style={{ color: '#ff9800' }}>{dniError}</span>}
            {formData.dni.length === 8 && !loadingDNI && !dniError && formData.fullName && (
              <span style={{ fontSize: '12px', color: '#4caf50', marginTop: '4px' }}>
                ✓ DNI válido - Datos obtenidos correctamente
              </span>
            )}
          </div>

          <div className="form-row">
            <div className="input-group">
              <label htmlFor="fullName">Nombre completo *</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                placeholder="Juan Pérez García"
                value={formData.fullName}
                onChange={handleChange}
                disabled={loadingDNI}
                style={{
                  backgroundColor: loadingDNI ? '#f5f5f5' : 'white',
                  cursor: loadingDNI ? 'wait' : 'text'
                }}
              />
              {errors.fullName && <span className="error-message">{errors.fullName}</span>}
              {formData.fullName && !errors.fullName && (
                <span style={{ fontSize: '12px', color: '#4caf50', marginTop: '4px' }}>
                  ✓ Nombre autocompletado desde RENIEC
                </span>
              )}
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="email">Correo electrónico *</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="juan.perez@example.com"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-row">
            <div className="input-group">
              <label htmlFor="phone">Teléfono *</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                placeholder="+51 999 999 999"
                value={formData.phone}
                onChange={handleChange}
              />
              {errors.phone && <span className="error-message">{errors.phone}</span>}
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="address">Dirección *</label>
            <input
              type="text"
              id="address"
              name="address"
              placeholder="Av. Principal 123, Distrito"
              value={formData.address}
              onChange={handleChange}
              disabled={loadingDNI}
              style={{
                backgroundColor: loadingDNI ? '#f5f5f5' : 'white',
                cursor: loadingDNI ? 'wait' : 'text'
              }}
            />
            {errors.address && <span className="error-message">{errors.address}</span>}
          </div>

          <div className="input-group">
            <label htmlFor="fechaNacimiento">Fecha de nacimiento</label>
            <input
              type="date"
              id="fechaNacimiento"
              name="fechaNacimiento"
              value={formData.fechaNacimiento}
              onChange={handleChange}
              disabled={loadingDNI}
              style={{
                backgroundColor: loadingDNI ? '#f5f5f5' : 'white',
                cursor: loadingDNI ? 'wait' : 'text'
              }}
            />
            {formData.fechaNacimiento && (
              <span style={{ fontSize: '12px', color: '#4caf50', marginTop: '4px' }}>
                ✓ Fecha de nacimiento registrada
              </span>
            )}
          </div>

          <div className="form-row">
            <div className="input-group">
              <label htmlFor="password">Contraseña *</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Mínimo 6 caracteres"
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>
            <div className="input-group">
              <label htmlFor="confirmPassword">Confirmar contraseña *</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Repite tu contraseña"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
            </div>
          </div>

          <div className="terms-section">
            <div className="terms-header">
              <button
                type="button"
                className="terms-toggle-btn"
                onClick={() => setShowTerms(!showTerms)}
              >
                {showTerms ? '▼ Ocultar' : '▶ Leer'} Términos y Condiciones
              </button>
            </div>

            {showTerms && (
              <div className="terms-content">
                <h3>Términos y Condiciones de Uso - Sistema de Denuncias Ciudadanas</h3>
                
                <p><strong>Última actualización:</strong> {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

                <h4>1. Aceptación de los Términos</h4>
                <p>
                  Al acceder y utilizar esta plataforma de denuncias ciudadanas, usted acepta estar sujeto a estos Términos y Condiciones de Uso. 
                  Si no está de acuerdo con alguna parte de estos términos, no debe utilizar esta plataforma.
                </p>

                <h4>2. Descripción del Servicio</h4>
                <p>
                  Esta plataforma permite a los ciudadanos registrar denuncias sobre incidencias urbanas, problemas de infraestructura, 
                  situaciones de seguridad pública y otros temas de interés ciudadano. Las denuncias son remitidas a las autoridades 
                  competentes para su evaluación y resolución.
                </p>

                <h4>3. Registro de Usuario</h4>
                <p>
                  Para utilizar esta plataforma, debe registrarse proporcionando información veraz, precisa y actualizada. 
                  Es su responsabilidad mantener la confidencialidad de sus credenciales de acceso y notificar inmediatamente 
                  cualquier uso no autorizado de su cuenta.
                </p>

                <h4>4. Uso Responsable</h4>
                <p>
                  Usted se compromete a utilizar esta plataforma de manera responsable y legal. Está prohibido:
                </p>
                <ul>
                  <li>Registrar denuncias falsas o maliciosas</li>
                  <li>Usar la plataforma para actividades ilegales o fraudulentas</li>
                  <li>Intentar acceder a áreas restringidas del sistema</li>
                  <li>Interferir con el funcionamiento normal de la plataforma</li>
                  <li>Publicar contenido difamatorio, ofensivo o inapropiado</li>
                  <li>Suplantar la identidad de otra persona</li>
                </ul>

                <h4>5. Veracidad de la Información</h4>
                <p>
                  Usted garantiza que toda la información proporcionada en sus denuncias es veraz, precisa y basada en hechos reales. 
                  El registro de denuncias falsas puede resultar en la suspensión de su cuenta y acciones legales correspondientes.
                </p>

                <h4>6. Privacidad y Protección de Datos</h4>
                <p>
                  Sus datos personales serán tratados de acuerdo con nuestra Política de Privacidad y la normativa vigente de protección 
                  de datos personales. La información proporcionada será utilizada exclusivamente para los fines relacionados con el 
                  funcionamiento de esta plataforma y la gestión de denuncias.
                </p>

                <h4>7. Gestión de Denuncias</h4>
                <p>
                  Las denuncias registradas serán revisadas y evaluadas por las autoridades competentes. No garantizamos que todas 
                  las denuncias resulten en acciones específicas, ya que las decisiones sobre su atención dependen de las autoridades 
                  responsables.
                </p>

                <h4>8. Propiedad Intelectual</h4>
                <p>
                  El contenido de esta plataforma, incluyendo textos, gráficos, logotipos y software, es propiedad de los administradores 
                  del sistema y está protegido por las leyes de propiedad intelectual.
                </p>

                <h4>9. Limitación de Responsabilidad</h4>
                <p>
                  Esta plataforma se proporciona "tal cual" sin garantías de ningún tipo. No nos hacemos responsables por:
                </p>
                <ul>
                  <li>La resolución o no resolución de las denuncias presentadas</li>
                  <li>Daños directos o indirectos derivados del uso de la plataforma</li>
                  <li>Interrupciones en el servicio por motivos técnicos o de mantenimiento</li>
                  <li>Decisiones tomadas por las autoridades respecto a las denuncias</li>
                </ul>

                <h4>10. Modificaciones de los Términos</h4>
                <p>
                  Nos reservamos el derecho de modificar estos términos en cualquier momento. Las modificaciones entrarán en vigor 
                  desde su publicación en la plataforma. Es su responsabilidad revisar periódicamente estos términos.
                </p>

                <h4>11. Suspensión y Terminación</h4>
                <p>
                  Nos reservamos el derecho de suspender o terminar su acceso a la plataforma en caso de incumplimiento de estos 
                  términos o por cualquier motivo que consideremos necesario para la seguridad e integridad del servicio.
                </p>

                <h4>12. Contacto</h4>
                <p>
                  Para consultas sobre estos términos o cualquier aspecto relacionado con la plataforma, puede contactarnos a través 
                  de los canales oficiales de comunicación establecidos.
                </p>

                <div className="terms-confirm">
                  <button
                    type="button"
                    className="terms-read-btn"
                    onClick={() => {
                      setTermsRead(true);
                      if (errors.termsRead) {
                        setErrors(prev => ({ ...prev, termsRead: '' }));
                      }
                    }}
                  >
                    ✓ He leído y comprendo los términos y condiciones
                  </button>
                </div>
              </div>
            )}

            {termsRead && (
              <div className="terms-read-indicator">
                ✓ Términos leídos
              </div>
            )}

            {errors.termsRead && <span className="error-message">{errors.termsRead}</span>}

            <div className="terms-checkbox">
              <label>
                <input
                  type="checkbox"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  disabled={!termsRead}
                />
                <span className={!termsRead ? 'disabled-text' : ''}>
                  Acepto los términos y condiciones {!termsRead && '(primero debes leerlos)'}
                </span>
              </label>
              {errors.agreeTerms && <span className="error-message">{errors.agreeTerms}</span>}
            </div>
          </div>

          {errors.submit && <span className="error-message" style={{ textAlign: 'center', display: 'block' }}>{errors.submit}</span>}
          <button type="submit" className="btn-register-submit" disabled={loadingDNI}>
            {loadingDNI ? 'Consultando DNI...' : 'Crear cuenta'}
          </button>
        </form>

        <div className="separator">O registrarse con</div>
        <div className="social-login-buttons">
          <button type="button" className="btn-social google">
            <FcGoogle size={22} /> Google
          </button>
          <button type="button" className="btn-social facebook">
            <FaFacebook size={22} color="#1877F2"/> Facebook
          </button>
        </div>

        <p className="login-link">
          ¿Ya tienes cuenta? <Link to="/iniciar-sesion">Inicia sesión aquí</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;