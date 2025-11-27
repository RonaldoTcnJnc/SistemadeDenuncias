-- ============================================================================
-- SCRIPT MEJORADO DE DATOS DE EJEMPLO - SEED DATA
-- Incluye datos para nuevas tablas (configuracion, categorías, estadísticas)
-- ============================================================================

-- ============================================================================
-- LIMPIAR DATOS PREVIOS (OPCIONAL - comentar si no desea resetear)
-- ============================================================================

-- TRUNCATE TABLE estadisticas_detalladas CASCADE;
-- TRUNCATE TABLE perfil_autoridad_extendido CASCADE;
-- TRUNCATE TABLE configuracion_autoridad CASCADE;
-- TRUNCATE TABLE autoridad_categorias CASCADE;

-- ============================================================================
-- INSERTAR CIUDADANOS DE EJEMPLO
-- ============================================================================

INSERT INTO ciudadanos (nombre_completo, email, telefono, direccion, ciudad, distrito, contraseña_hash, fecha_registro, verificado, notificaciones_email, notificaciones_push, boletin_informativo) 
VALUES 
('Juan Pérez García', 'juan.perez@example.com', '+51 987 654 321', 'Calle Principal 123', 'Cusco', 'Norte', 'hashed_password_123', NOW() - INTERVAL '6 months', TRUE, TRUE, FALSE, TRUE),
('María López Rodríguez', 'maria.lopez@example.com', '+51 987 654 322', 'Avenida Central 456', 'Cusco', 'Sur', 'hashed_password_124', NOW() - INTERVAL '4 months', TRUE, TRUE, TRUE, TRUE),
('Carlos Mendez Torres', 'carlos.mendez@example.com', '+51 987 654 323', 'Calle Secundaria 789', 'Cusco', 'Este', 'hashed_password_125', NOW() - INTERVAL '3 months', TRUE, TRUE, FALSE, FALSE),
('Ana García Flores', 'ana.garcia@example.com', '+51 987 654 324', 'Pasaje Alterno 321', 'Cusco', 'Oeste', 'hashed_password_126', NOW() - INTERVAL '2 months', TRUE, FALSE, FALSE, TRUE),
('Roberto Sánchez Silva', 'roberto.sanchez@example.com', '+51 987 654 325', 'Avenida del Parque 654', 'Cusco', 'Norte', 'hashed_password_127', NOW() - INTERVAL '1 month', TRUE, TRUE, TRUE, FALSE)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- INSERTAR AUTORIDADES DE EJEMPLO CON NUEVOS CAMPOS
-- ============================================================================

INSERT INTO autoridades (nombre_completo, email, telefono, numero_empleado, departamento, cargo, distrito_asignado, contraseña_hash, fecha_ingreso, verificado, activo, rol, nivel_permiso, entidad, especialidad, estado_activo, bio) 
VALUES 
('Lucía Méndez López', 'lucia.mendez@municipalidad.gob.pe', '+51 991 234 567', 'AUT001', 'Alcaldía', 'Dirección Municipal', 'Norte', 'hashed_password_auth_001', NOW() - INTERVAL '3 years', TRUE, TRUE, 'Administrador', 3, 'municipalidad', 'Gestión Municipal', TRUE, 'Responsable de coordinar las acciones municipales y atención de denuncias en su distrito.'),
('Carlos Ramírez Ruiz', 'carlos.ramirez@pnp.gob.pe', '+51 991 234 568', 'AUT002', 'Tránsito', 'Jefe de Unidad', 'Norte', 'hashed_password_auth_002', NOW() - INTERVAL '2 years', TRUE, TRUE, 'Supervisor', 2, 'pnp', 'Tránsito', TRUE, 'Responsable de investigación y seguimiento de accidentes de tránsito.'),
('Martina Flores Quispe', 'martina.flores@fiscalia.gob.pe', '+51 991 234 569', 'AUT003', 'Fiscalía', 'Fiscal Especializada', 'Sur', 'hashed_password_auth_003', NOW() - INTERVAL '18 months', TRUE, TRUE, 'Supervisor', 2, 'fiscalia', 'Delitos Viales', TRUE, 'Especialista en delitos de tránsito y conducción peligrosa.'),
('Jorge Ticona Apaza', 'jorge.ticona@municipalidad.gob.pe', '+51 991 234 570', 'AUT004', 'Servicios', 'Inspector de Tránsito', 'Este', 'hashed_password_auth_004', NOW() - INTERVAL '1 year', TRUE, TRUE, 'Operador', 1, 'municipalidad', 'Inspección', TRUE, 'Inspector de cumplimiento de normas de tránsito municipal.'),
('Patricia Condori Mamani', 'patricia.condori@pnp.gob.pe', '+51 991 234 571', 'AUT005', 'Análisis', 'Analista de Datos', 'Oeste', 'hashed_password_auth_005', NOW() - INTERVAL '6 months', TRUE, TRUE, 'Analista', 2, 'pnp', 'Análisis', TRUE, 'Analista de datos y reportes de incidentes de tránsito.')
ON CONFLICT (email) DO NOTHING;

-- ============================================================================
-- INSERTAR CONFIGURACIÓN DE AUTORIDADES
-- ============================================================================

INSERT INTO configuracion_autoridad (autoridad_id, notificaciones_email, notificaciones_sms, alertas_urgentes, entidad_prioritaria, categorias_prioritarias, api_key_activa)
SELECT id, TRUE, FALSE, TRUE, entidad, 
  CASE 
    WHEN entidad = 'municipalidad' THEN 'Apelación de papeleta,Reclamo por inspección,Estacionamiento indebido'
    WHEN entidad = 'pnp' THEN 'Accidentes,Choques,Atropellos'
    WHEN entidad = 'fiscalia' THEN 'Lesiones graves,Homicidio culposo'
    ELSE 'Otros'
  END,
  FALSE
FROM autoridades
WHERE configuracion_autoridad.autoridad_id IS NULL OR NOT EXISTS (SELECT 1 FROM configuracion_autoridad WHERE configuracion_autoridad.autoridad_id = autoridades.id)
ON CONFLICT (autoridad_id) DO NOTHING;

-- ============================================================================
-- INSERTAR PERFIL EXTENDIDO DE AUTORIDADES
-- ============================================================================

INSERT INTO perfil_autoridad_extendido (autoridad_id, biografia, experiencia_anos, especializaciones, idiomas, activo, verificado)
SELECT id, 
  CASE nombre_completo
    WHEN 'Lucía Méndez López' THEN 'Profesional en administración pública con 15 años de experiencia en gestión municipal.'
    WHEN 'Carlos Ramírez Ruiz' THEN 'Oficial de la PNP especializado en investigación de tránsito con 12 años de experiencia.'
    WHEN 'Martina Flores Quispe' THEN 'Fiscal especializada en delitos de tránsito desde hace 8 años.'
    WHEN 'Jorge Ticona Apaza' THEN 'Inspector municipal con 5 años en regulación de tránsito urbano.'
    ELSE 'Profesional en análisis de datos y estadísticas de seguridad vial.'
  END,
  CASE nombre_completo
    WHEN 'Lucía Méndez López' THEN 15
    WHEN 'Carlos Ramírez Ruiz' THEN 12
    WHEN 'Martina Flores Quispe' THEN 8
    WHEN 'Jorge Ticona Apaza' THEN 5
    ELSE 6
  END,
  CASE entidad
    WHEN 'municipalidad' THEN 'Gestión administrativa, Regulación de tránsito'
    WHEN 'pnp' THEN 'Investigación de accidentes, Seguridad vial'
    WHEN 'fiscalia' THEN 'Delitos viales, Jurisprudencia'
    ELSE 'Análisis de datos, Estadística'
  END,
  'Español, Quechua',
  TRUE, TRUE
FROM autoridades
WHERE NOT EXISTS (SELECT 1 FROM perfil_autoridad_extendido WHERE perfil_autoridad_extendido.autoridad_id = autoridades.id)
ON CONFLICT (autoridad_id) DO NOTHING;

-- ============================================================================
-- ASOCIAR AUTORIDADES CON CATEGORÍAS
-- ============================================================================

-- Municipalidad
INSERT INTO autoridad_categorias (autoridad_id, categoria_id, prioridad)
SELECT a.id, c.id, 1
FROM autoridades a, categorias_denuncias c
WHERE a.entidad = 'municipalidad' AND c.entidad = 'municipalidad'
ON CONFLICT (autoridad_id, categoria_id) DO NOTHING;

-- PNP
INSERT INTO autoridad_categorias (autoridad_id, categoria_id, prioridad)
SELECT a.id, c.id, 1
FROM autoridades a, categorias_denuncias c
WHERE a.entidad = 'pnp' AND c.entidad = 'pnp'
ON CONFLICT (autoridad_id, categoria_id) DO NOTHING;

-- Fiscalía
INSERT INTO autoridad_categorias (autoridad_id, categoria_id, prioridad)
SELECT a.id, c.id, 1
FROM autoridades a, categorias_denuncias c
WHERE a.entidad = 'fiscalia' AND c.entidad = 'fiscalia'
ON CONFLICT (autoridad_id, categoria_id) DO NOTHING;

-- ============================================================================
-- INSERTAR DENUNCIAS DE EJEMPLO
-- ============================================================================

INSERT INTO denuncias (ciudadano_id, titulo, descripcion, categoria, ubicacion, latitud, longitud, distrito, estado, fecha_reporte, prioridad, entidad_responsable, color_estado) 
VALUES 
(1, 'Bache peligroso en Avenida Principal', 'Existe un bache de aproximadamente 2 metros que representa un peligro para los vehículos', 'Estacionamiento indebido', 'Avenida Principal 1200', -13.5320, -71.9787, 'Norte', 'Resuelta', NOW() - INTERVAL '30 days', 'Alta', 'municipalidad', '#22c55e'),
(2, 'Accidente de tránsito reportado', 'Colisión entre dos vehículos sin heridos pero con daños materiales', 'Accidentes', 'Calle Principal esquina Secundaria', -13.5325, -71.9790, 'Sur', 'En Progreso', NOW() - INTERVAL '10 days', 'Media', 'pnp', '#eab308'),
(3, 'Lesión grave por fuga de vehículo', 'Atropello con fuga del responsable, víctima con lesiones graves', 'Lesiones graves', 'Calle Secundaria 456', -13.5330, -71.9795, 'Este', 'Pendiente', NOW() - INTERVAL '5 days', 'Alta', 'fiscalia', '#ef4444'),
(4, 'Conductor ebrio en zona residencial', 'Persona conduciendo en estado de ebriedad en avenida de alto flujo', 'Conductor ebrio', 'Pasaje Alterno 321', -13.5335, -71.9800, 'Oeste', 'Pendiente', NOW() - INTERVAL '3 days', 'Baja', 'pnp', '#f97316'),
(5, 'Apelación de papeleta de tránsito', 'Reclamo formal sobre multa por exceso de velocidad que considera injusta', 'Apelación de papeleta', 'Avenida del Parque 654', -13.5340, -71.9805, 'Norte', 'En Progreso', NOW() - INTERVAL '2 days', 'Media', 'municipalidad', '#eab308')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- INSERTAR ESTADÍSTICAS DETALLADAS POR MES/CATEGORÍA/ESTADO
-- ============================================================================

INSERT INTO estadisticas_detalladas (anio, mes, categoria, estado, cantidad, tiempo_promedio_horas, distrito, entidad)
VALUES
-- 2025 - Enero - Municipalidad
(2025, 1, 'Apelación de papeleta', 'Resuelta', 35, 24.5, 'Norte', 'municipalidad'),
(2025, 1, 'Reclamo por inspección', 'Resuelta', 28, 18.0, 'Norte', 'municipalidad'),
(2025, 1, 'Estacionamiento indebido', 'Pendiente', 15, 0, 'Sur', 'municipalidad'),
(2025, 1, 'Exceso de velocidad', 'En Progreso', 22, 36.0, 'Este', 'municipalidad'),

-- 2025 - Enero - PNP
(2025, 1, 'Accidentes', 'Resuelta', 42, 48.0, 'Norte', 'pnp'),
(2025, 1, 'Choques', 'Resuelta', 38, 40.5, 'Sur', 'pnp'),
(2025, 1, 'Atropellos', 'En Progreso', 12, 72.0, 'Este', 'pnp'),
(2025, 1, 'Conductor ebrio', 'Pendiente', 8, 0, 'Oeste', 'pnp'),

-- 2025 - Enero - Fiscalía
(2025, 1, 'Lesiones graves', 'En Progreso', 5, 96.0, 'Norte', 'fiscalia'),
(2025, 1, 'Homicidio culposo', 'En Progreso', 2, 240.0, 'Sur', 'fiscalia'),

-- 2025 - Febrero - Municipalidad
(2025, 2, 'Apelación de papeleta', 'Resuelta', 28, 22.0, 'Norte', 'municipalidad'),
(2025, 2, 'Reclamo por inspección', 'Resuelta', 25, 16.5, 'Sur', 'municipalidad'),
(2025, 2, 'Estacionamiento indebido', 'Resuelta', 30, 20.0, 'Este', 'municipalidad'),

-- 2025 - Febrero - PNP
(2025, 2, 'Accidentes', 'Resuelta', 38, 45.0, 'Norte', 'pnp'),
(2025, 2, 'Choques', 'Resuelta', 35, 38.0, 'Sur', 'pnp'),
(2025, 2, 'Atropellos', 'Resuelta', 10, 60.0, 'Este', 'pnp'),

-- Datos históricos 2024
(2024, 12, 'Apelación de papeleta', 'Resuelta', 40, 28.0, 'Norte', 'municipalidad'),
(2024, 12, 'Accidentes', 'Resuelta', 50, 50.0, 'Norte', 'pnp'),
(2024, 12, 'Lesiones graves', 'Resuelta', 4, 120.0, 'Sur', 'fiscalia')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- INSERTAR ASIGNACIONES DE DENUNCIAS
-- ============================================================================

INSERT INTO asignacion_denuncia (denuncia_id, autoridad_id, fecha_asignacion, estado_asignacion) 
VALUES 
(1, 4, NOW() - INTERVAL '30 days', 'Completada'),
(2, 2, NOW() - INTERVAL '10 days', 'En Proceso'),
(3, 3, NOW() - INTERVAL '5 days', 'Pendiente'),
(4, 2, NOW() - INTERVAL '3 days', 'Pendiente'),
(5, 1, NOW() - INTERVAL '2 days', 'En Proceso')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- INSERTAR NOTIFICACIONES DEL SISTEMA
-- ============================================================================

INSERT INTO notificaciones_sistema (autoridad_id, tipo_notificacion, mensaje, leida)
VALUES 
(1, 'nueva_denuncia', 'Nueva apelación de papeleta asignada', FALSE),
(2, 'denuncia_urgente', 'Accidente grave en su zona de responsabilidad', FALSE),
(3, 'nueva_denuncia', 'Caso de lesiones graves derivado a fiscalía', FALSE),
(4, 'nueva_denuncia', 'Denuncia de estacionamiento indebido registrada', TRUE)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- CONFIRMACIÓN
-- ============================================================================

/*
Datos de ejemplo insertados exitosamente:
- Ciudadanos: 5
- Autoridades: 5 (distribuidas en Municipalidad, PNP y Fiscalía)
- Configuraciones: 5 (una por autoridad)
- Perfiles extendidos: 5
- Categorías asociadas: distribución automática por entidad
- Denuncias: 5 con colores y entidad responsable
- Estadísticas detalladas: 16 registros mensuales
- Notificaciones: 4

El sistema está listo para:
- Perfil dinámico por autoridad
- Configuración personalizada
- Gestión de usuarios por entidad
- Gráficos estadísticos dinámicos
- Mapa de denuncias con colores por estado
*/
