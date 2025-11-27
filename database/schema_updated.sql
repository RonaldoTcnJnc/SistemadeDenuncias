-- ============================================================================
-- SCRIPT DE ACTUALIZACIÓN DE SCHEMA - BASE DE DATOS SISTEMA DE DENUNCIAS
-- Adaptaciones para nuevas interfaces (Perfil, Configuración, Usuarios, Estadísticas)
-- ============================================================================

-- ============================================================================
-- ALTERACIONES A TABLA EXISTENTE: autoridades
-- ============================================================================

-- Agregar campos nuevos a la tabla autoridades para soportar:
-- - Bio/Descripción del autoridad
-- - Avatar (imagen perfil)
-- - Entidad (Municipalidad, PNP-Tránsito, Fiscalía)
-- - Subcategorías de especialidad

ALTER TABLE autoridades ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE autoridades ADD COLUMN IF NOT EXISTS avatar_url VARCHAR(500);
ALTER TABLE autoridades ADD COLUMN IF NOT EXISTS entidad VARCHAR(100); -- Municipalidad, PNP-Tránsito, Fiscalía de Tránsito, Centro de Denuncias, Analista
ALTER TABLE autoridades ADD COLUMN IF NOT EXISTS especialidad VARCHAR(100); -- Vialidad, Alumbrado, Limpieza, Tránsito, etc.
ALTER TABLE autoridades ADD COLUMN IF NOT EXISTS estado_activo BOOLEAN DEFAULT TRUE;

-- ============================================================================
-- TABLA NUEVA: configuracion_autoridad
-- Para guardar preferencias personalizadas por autoridad
-- ============================================================================

CREATE TABLE IF NOT EXISTS configuracion_autoridad (
    id SERIAL PRIMARY KEY,
    autoridad_id INTEGER NOT NULL UNIQUE REFERENCES autoridades(id) ON DELETE CASCADE,
    
    -- Notificaciones
    notificaciones_email BOOLEAN DEFAULT TRUE,
    notificaciones_sms BOOLEAN DEFAULT FALSE,
    alertas_urgentes BOOLEAN DEFAULT TRUE,
    
    -- Privacidad y Seguridad
    visibilidad_perfil VARCHAR(50) DEFAULT 'autoridad', -- publico, autoridad, privado
    verificacion_dos_factores BOOLEAN DEFAULT FALSE,
    
    -- Preferencias de Reporte
    entidad_prioritaria VARCHAR(100),
    categorias_prioritarias VARCHAR(500), -- JSON o lista separada por comas
    radio_busqueda_km INTEGER DEFAULT 5,
    
    -- Integración
    integrar_siat BOOLEAN DEFAULT FALSE,
    integrar_mtc BOOLEAN DEFAULT FALSE,
    api_key_activa BOOLEAN DEFAULT FALSE,
    api_key VARCHAR(255),
    
    -- Horario
    zona_horaria VARCHAR(50) DEFAULT 'America/Lima',
    horario_disponibilidad VARCHAR(100) DEFAULT 'lunes-viernes-8am-6pm',
    
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_configuracion_autoridad ON configuracion_autoridad(autoridad_id);

-- ============================================================================
-- TABLA NUEVA: categorias_denuncias
-- Para almacenar dinámicamente las categorías por entidad
-- ============================================================================

CREATE TABLE IF NOT EXISTS categorias_denuncias (
    id SERIAL PRIMARY KEY,
    entidad VARCHAR(100) NOT NULL, -- PNP, Fiscalía, Municipalidad, etc.
    categoria VARCHAR(100) NOT NULL,
    descripcion TEXT,
    icon_url VARCHAR(255),
    color_codigo VARCHAR(7), -- hex color
    activa BOOLEAN DEFAULT TRUE,
    orden INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(entidad, categoria)
);

CREATE INDEX idx_categorias_entidad ON categorias_denuncias(entidad);
CREATE INDEX idx_categorias_activa ON categorias_denuncias(activa);

-- ============================================================================
-- TABLA NUEVA: estadisticas_detalladas
-- Para almacenar estadísticas granulares por mes, categoría y estado
-- ============================================================================

CREATE TABLE IF NOT EXISTS estadisticas_detalladas (
    id SERIAL PRIMARY KEY,
    anio INTEGER NOT NULL,
    mes INTEGER NOT NULL, -- 1-12
    categoria VARCHAR(100),
    estado VARCHAR(50), -- Pendiente, En Progreso, Resuelta
    cantidad INTEGER DEFAULT 0,
    tiempo_promedio_horas DECIMAL(10, 2),
    distrito VARCHAR(100),
    entidad VARCHAR(100),
    
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(anio, mes, categoria, estado, distrito, entidad)
);

CREATE INDEX idx_stats_ano_mes ON estadisticas_detalladas(anio, mes);
CREATE INDEX idx_stats_categoria ON estadisticas_detalladas(categoria);
CREATE INDEX idx_stats_distrito ON estadisticas_detalladas(distrito);
CREATE INDEX idx_stats_entidad ON estadisticas_detalladas(entidad);

-- ============================================================================
-- TABLA NUEVA: entidades_transito
-- Registro maestro de entidades de tránsito del Perú
-- ============================================================================

CREATE TABLE IF NOT EXISTS entidades_transito (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(50) UNIQUE NOT NULL, -- pnp, fiscalia, municipalidad
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    contacto_email VARCHAR(255),
    contacto_telefono VARCHAR(20),
    sitio_web VARCHAR(255),
    logo_url VARCHAR(500),
    activa BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO entidades_transito (codigo, nombre, descripcion, contacto_email)
VALUES 
('pnp', 'PNP – Unidad de Tránsito', 'Reciben denuncias por accidentes, choques, atropellos, fuga, o conductores ebrios.', 'denuncias@pnp.gob.pe'),
('fiscalia', 'Fiscalía de Tránsito', 'Interviene cuando el caso constituye delito (lesiones graves, homicidio culposo, fuga, etc.).', 'denuncias@fiscalia.gob.pe'),
('municipalidad', 'Municipalidades / SAT', 'Gestionan reclamos o apelaciones por papeletas y problemas con inspectores de tránsito.', 'denuncias@municipalidad.gob.pe')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- ALTERACIONES A TABLA: denuncias
-- Agregar campos para mejor clasificación y mapeo
-- ============================================================================

ALTER TABLE denuncias ADD COLUMN IF NOT EXISTS entidad_responsable VARCHAR(100);
ALTER TABLE denuncias ADD COLUMN IF NOT EXISTS color_estado VARCHAR(7); -- Hex color para marcador en mapa
ALTER TABLE denuncias ADD COLUMN IF NOT EXISTS coordenadas_precision DECIMAL(15,10); -- para presición GPS

-- ============================================================================
-- TABLA NUEVA: perfil_autoridad_extendido
-- Datos adicionales de perfil para autoridades (avatar, redes sociales, etc)
-- ============================================================================

CREATE TABLE IF NOT EXISTS perfil_autoridad_extendido (
    id SERIAL PRIMARY KEY,
    autoridad_id INTEGER NOT NULL UNIQUE REFERENCES autoridades(id) ON DELETE CASCADE,
    
    biografia TEXT,
    avatar_base64 TEXT, -- Almacenar imagen en base64
    foto_perfil_url VARCHAR(500),
    
    redes_sociales JSONB, -- {twitter, facebook, linkedin, etc}
    experiencia_anos INTEGER,
    especializaciones VARCHAR(500),
    idiomas VARCHAR(255),
    
    activo BOOLEAN DEFAULT TRUE,
    verificado BOOLEAN DEFAULT FALSE,
    fecha_verificacion TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_perfil_autoridad ON perfil_autoridad_extendido(autoridad_id);

-- ============================================================================
-- ALTERACIONES A TABLA: historial_estado_denuncia
-- Agregar información de transición de estado
-- ============================================================================

ALTER TABLE historial_estado_denuncia ADD COLUMN IF NOT EXISTS color_estado_anterior VARCHAR(7);
ALTER TABLE historial_estado_denuncia ADD COLUMN IF NOT EXISTS color_estado_nuevo VARCHAR(7);

-- ============================================================================
-- INSERCIÓN DE CATEGORÍAS DE DENUNCIAS POR ENTIDAD
-- ============================================================================

INSERT INTO categorias_denuncias (entidad, categoria, descripcion, color_codigo) VALUES
-- PNP Categorías
('pnp', 'Accidentes', 'Accidentes de tránsito', '#ef4444'),
('pnp', 'Choques', 'Choques entre vehículos', '#f97316'),
('pnp', 'Atropellos', 'Atropellos a personas o animales', '#dc2626'),
('pnp', 'Fuga', 'Fuga del lugar del accidente', '#991b1b'),
('pnp', 'Conductor ebrio', 'Conducción bajo influencia de alcohol', '#7f1d1d'),
('pnp', 'Otros', 'Otros delitos de tránsito', '#6b7280'),

-- Fiscalía Categorías
('fiscalia', 'Lesiones graves', 'Lesiones graves en accidente', '#dc2626'),
('fiscalia', 'Homicidio culposo', 'Muertes por negligencia en conducción', '#7f1d1d'),
('fiscalia', 'Fuga de accidente', 'Fuga con responsabilidad legal', '#991b1b'),
('fiscalia', 'Conducción bajo influencia', 'DUI con consecuencias legales', '#7f1d1d'),
('fiscalia', 'Delitos viales', 'Otros delitos relacionados con tránsito', '#6b7280'),

-- Municipalidad Categorías
('municipalidad', 'Apelación de papeleta', 'Recurso de apelación por multa', '#2563eb'),
('municipalidad', 'Reclamo por inspección', 'Reclamo sobre procedimiento de inspección', '#1d4ed8'),
('municipalidad', 'Estacionamiento indebido', 'Denuncias por estacionamiento prohibido', '#0369a1'),
('municipalidad', 'Exceso de velocidad', 'Denuncias por velocidad inadecuada', '#1e7e34'),
('municipalidad', 'Señalización', 'Problemas con señales de tránsito', '#f59e0b'),
('municipalidad', 'Otros', 'Otros reclamos municipales', '#6b7280')
ON CONFLICT (entidad, categoria) DO NOTHING;

-- ============================================================================
-- ACTUALIZAR TABLA autoridades CON VALORES DEFAULT
-- ============================================================================

UPDATE autoridades SET 
    entidad = 'municipalidad',
    especialidad = 'Gestión Municipal',
    estado_activo = TRUE
WHERE entidad IS NULL;

-- ============================================================================
-- CREAR ÍNDICES ADICIONALES PARA PERFORMANCE
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_autoridades_entidad ON autoridades(entidad);
CREATE INDEX IF NOT EXISTS idx_autoridades_especialidad ON autoridades(especialidad);
CREATE INDEX IF NOT EXISTS idx_denuncias_entidad_responsable ON denuncias(entidad_responsable);
CREATE INDEX IF NOT EXISTS idx_denuncias_estado_color ON denuncias(estado, color_estado);

-- ============================================================================
-- TABLA DE MAPEO: autoridad_a_categorias
-- Para asociar qué autoridades atienden qué categorías
-- ============================================================================

CREATE TABLE IF NOT EXISTS autoridad_categorias (
    id SERIAL PRIMARY KEY,
    autoridad_id INTEGER NOT NULL REFERENCES autoridades(id) ON DELETE CASCADE,
    categoria_id INTEGER NOT NULL REFERENCES categorias_denuncias(id) ON DELETE CASCADE,
    prioridad INTEGER DEFAULT 1,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(autoridad_id, categoria_id)
);

CREATE INDEX idx_autoridad_categorias_autoridad ON autoridad_categorias(autoridad_id);
CREATE INDEX idx_autoridad_categorias_categoria ON autoridad_categorias(categoria_id);

-- ============================================================================
-- COMENTARIOS Y DOCUMENTACIÓN
-- ============================================================================

/*
CAMBIOS REALIZADOS PARA ADAPTAR A LAS NUEVAS INTERFACES:

1. PERFIL DE AUTORIDAD (PerfilAuthority.jsx):
   - Agregado: bio, avatar_url, entidad, especialidad
   - Nueva tabla: perfil_autoridad_extendido para datos complejos
   - Permite editar y guardar cambios de perfil

2. CONFIGURACIÓN (ConfiguracionAuthority.jsx):
   - Nueva tabla: configuracion_autoridad
   - Almacena preferencias de notificaciones, seguridad, integraciones
   - Asociada a cada autoridad de forma única

3. USUARIOS (Usuarios.jsx):
   - Agregado campo: entidad en tabla autoridades
   - Nueva tabla: entidades_transito (maestro de entidades)
   - Permite filtrar y gestionar usuarios por entidad

4. ESTADÍSTICAS (Estadisticas.jsx):
   - Nueva tabla: estadisticas_detalladas
   - Almacena datos granulares por mes, categoría, estado
   - Soporta consultas dinámicas de gráficos

5. CATEGORÍAS DINÁMICAS:
   - Nueva tabla: categorias_denuncias
   - Nueva tabla: autoridad_categorias (mapeo)
   - Permite asociar categorías a entidades y autoridades

6. DENUNCIAS EN MAPA (Denuncias.jsx):
   - Agregado: color_estado para marcadores de color en Leaflet
   - Agregado: entidad_responsable para filtrar por entidad

FLUJO DE MIGRACIÓN (para BD existente):
1. Ejecutar este script de ALTER TABLE
2. Ejecutar INSERT de categorías
3. Actualizar registros existentes de autoridades
4. Crear configuraciones por defecto para autoridades existentes
5. Cargar datos históricos en estadisticas_detalladas

*/

