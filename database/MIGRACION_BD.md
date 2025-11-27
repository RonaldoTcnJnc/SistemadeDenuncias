# 📋 GUÍA DE ACTUALIZACIÓN DE BASE DE DATOS
## Sistema de Denuncias - Adaptación a Nuevas Interfaces

**Fecha**: 27 de noviembre de 2025  
**Versión**: 2.0  
**Estado**: Nuevas tablas y campos para soportar:
- ✅ Perfil de autoridad dinámico
- ✅ Configuración personalizada
- ✅ Gestión de usuarios por entidad
- ✅ Estadísticas granulares
- ✅ Categorías dinámicas por entidad

---

## 📂 Archivos Nuevos Generados

### 1. `schema_updated.sql`
Script completo de actualización del esquema de base de datos.

**Contenido:**
- Alteraciones a tabla `autoridades` (nuevos campos)
- Tabla `configuracion_autoridad` (preferencias por autoridad)
- Tabla `categorias_denuncias` (categorías dinámicas)
- Tabla `estadisticas_detalladas` (stats granulares)
- Tabla `entidades_transito` (maestro de entidades)
- Tabla `perfil_autoridad_extendido` (datos de perfil)
- Tabla `autoridad_categorias` (mapeo m2m)
- Índices de performance

### 2. `seed_data_updated.sql`
Datos de ejemplo adaptados a las nuevas tablas.

**Contenido:**
- Ciudadanos de ejemplo (5 registros)
- Autoridades con campos nuevos (5 registros)
- Configuraciones por autoridad (5 registros)
- Perfiles extendidos (5 registros)
- Asociaciones autoridad-categorías
- Denuncias con entidad y color de estado (5 registros)
- Estadísticas detalladas por mes/categoría/estado (16 registros)
- Notificaciones del sistema (4 registros)

---

## 🔧 Pasos de Instalación

### Opción A: Base de Datos Nueva

```bash
# 1. Crear base de datos
createdb sistema_denuncias

# 2. Ejecutar schema original (si aún no existe)
psql -U postgres -d sistema_denuncias -f database/schema.sql

# 3. Ejecutar actualizaciones (schema_updated.sql)
psql -U postgres -d sistema_denuncias -f database/schema_updated.sql

# 4. Insertar datos de ejemplo (seed_data_updated.sql)
psql -U postgres -d sistema_denuncias -f database/seed_data_updated.sql

# 5. Verificar
psql -U postgres -d sistema_denuncias -c "SELECT COUNT(*) FROM autoridades;"
```

### Opción B: Base de Datos Existente (Migración)

```bash
# 1. Respaldar base de datos actual
pg_dump -U postgres sistema_denuncias > backup_$(date +%Y%m%d).sql

# 2. Ejecutar script de actualización
psql -U postgres -d sistema_denuncias -f database/schema_updated.sql

# 3. Opcionalmente, cargar nuevos datos de ejemplo
# (NO ejecutar seed_data_updated.sql completo si tiene datos)
# Ejecutar solo las nuevas tablas necesarias

# 4. Verificar estructura
psql -U postgres -d sistema_denuncias -c "\dt"
```

---

## 📊 Cambios Principales en la Estructura

### Tabla: `autoridades` (Alteraciones)

| Campo Nuevo | Tipo | Descripción |
|---|---|---|
| `bio` | TEXT | Biografía/descripción del autoridad |
| `avatar_url` | VARCHAR(500) | URL a imagen de avatar |
| `entidad` | VARCHAR(100) | Entidad asignada (municipalidad, pnp, fiscalia) |
| `especialidad` | VARCHAR(100) | Área de especialización (Tránsito, Gestión, etc.) |
| `estado_activo` | BOOLEAN | Flag de actividad |

### Nueva Tabla: `configuracion_autoridad`

Almacena preferencias personalizadas por autoridad.

```sql
- notificaciones_email (BOOLEAN)
- notificaciones_sms (BOOLEAN)
- alertas_urgentes (BOOLEAN)
- entidad_prioritaria (VARCHAR)
- categorias_prioritarias (VARCHAR)
- verificacion_dos_factores (BOOLEAN)
- api_key_activa (BOOLEAN)
- zona_horaria (VARCHAR)
- horario_disponibilidad (VARCHAR)
```

### Nueva Tabla: `categorias_denuncias`

Categorías dinámicas por entidad de tránsito.

```sql
- entidad (VARCHAR)
- categoria (VARCHAR)
- descripcion (TEXT)
- color_codigo (VARCHAR) -- Hex color para UI
- activa (BOOLEAN)
```

### Nueva Tabla: `estadisticas_detalladas`

Estadísticas granulares para gráficos dinámicos.

```sql
- anio (INTEGER)
- mes (INTEGER) -- 1-12
- categoria (VARCHAR)
- estado (VARCHAR)
- cantidad (INTEGER)
- tiempo_promedio_horas (DECIMAL)
- distrito (VARCHAR)
- entidad (VARCHAR)
```

### Nueva Tabla: `perfil_autoridad_extendido`

Datos adicionales de perfil.

```sql
- biografia (TEXT)
- avatar_base64 (TEXT)
- experiencia_anos (INTEGER)
- especializaciones (VARCHAR)
- idiomas (VARCHAR)
- verificado (BOOLEAN)
```

---

## 🔗 Relaciones Clave

```
autoridades (1) ──┬── (M) configuracion_autoridad
                  ├── (M) perfil_autoridad_extendido
                  ├── (M) autoridad_categorias
                  └── (M) asignacion_denuncia

categorias_denuncias ──── (M) autoridad_categorias

denuncias ────── (M) actualizaciones_denuncia
              ── (M) asignacion_denuncia
              ── (M) estadisticas_detalladas
```

---

## 🎯 Mapeo: Interfaces ↔ Tablas

### PerfilAuthority.jsx
- Lee/escribe: `autoridades`, `perfil_autoridad_extendido`
- Avatar y bio almacenados en `perfil_autoridad_extendido.avatar_base64`

### ConfiguracionAuthority.jsx
- Lee/escribe: `configuracion_autoridad`, `categorias_denuncias`
- Entidades desde: `entidades_transito` (maestro)

### Usuarios.jsx
- Lee: `autoridades`, `autoridades.entidad`
- Filtra por entidad y muestra categorías desde `autoridad_categorias`

### Estadisticas.jsx
- Lee: `estadisticas_detalladas`
- Gráficos dinámicos por mes, año, categoría, estado

### Denuncias.jsx (Mapa)
- Lee: `denuncias`, `denuncias.color_estado`, `denuncias.entidad_responsable`
- Marcadores coloreados según estado

---

## 🔐 Índices de Performance

Se crean índices en:
- `configuracion_autoridad.autoridad_id`
- `categorias_denuncias.entidad`
- `estadisticas_detalladas.anio, mes`
- `autoridad_categorias.autoridad_id, categoria_id`
- `autoridades.entidad, especialidad`
- `denuncias.entidad_responsable`

---

## ✅ Verificación Post-Instalación

```sql
-- Verificar tablas nuevas existen
SELECT COUNT(*) FROM information_schema.tables 
WHERE table_name IN ('configuracion_autoridad', 'categorias_denuncias', 
                     'estadisticas_detalladas', 'perfil_autoridad_extendido',
                     'entidades_transito', 'autoridad_categorias');

-- Verificar campos nuevos en autoridades
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'autoridades' 
AND column_name IN ('entidad', 'especialidad', 'bio', 'avatar_url');

-- Verificar datos
SELECT COUNT(*) FROM configuracion_autoridad;
SELECT COUNT(*) FROM categorias_denuncias;
SELECT COUNT(*) FROM estadisticas_detalladas;
SELECT COUNT(*) FROM perfil_autoridad_extendido;

-- Verificar relaciones
SELECT a.nombre_completo, a.entidad, c.nombre
FROM autoridades a
LEFT JOIN configuracion_autoridad ca ON a.id = ca.autoridad_id
LEFT JOIN entidades_transito c ON a.entidad = c.codigo;
```

---

## 🚀 Backend Integration Checklist

Para que el backend aproveche las nuevas tablas:

- [ ] Endpoint GET `/api/autoridades/:id/perfil` → `perfil_autoridad_extendido`
- [ ] Endpoint PUT `/api/autoridades/:id/perfil` → actualizar perfil
- [ ] Endpoint GET `/api/autoridades/:id/config` → `configuracion_autoridad`
- [ ] Endpoint PUT `/api/autoridades/:id/config` → guardar configuración
- [ ] Endpoint GET `/api/categorias?entidad=X` → `categorias_denuncias`
- [ ] Endpoint GET `/api/estadisticas?anio=2025&mes=1` → `estadisticas_detalladas`
- [ ] Endpoint GET `/api/denuncias?entidad=municipalidad` → denuncias filtradas

---

## 📝 Notas Importantes

1. **Compatibilidad Retroactiva**: El script usa `ON CONFLICT DO NOTHING` para no duplicar datos al re-ejecutar.

2. **Base64 Avatar**: Actualmente guardado como TEXT. Para producción, considerar usar storage externo (S3, Azure Blob) y guardar URLs.

3. **Estadísticas**: Los datos de ejemplo en `estadisticas_detalladas` son manuales. Para producción, crear triggers o jobs que agreguen datos desde `denuncias`.

4. **Entidades Maestro**: Las 3 entidades principales están pre-insertadas en `entidades_transito`.

5. **Colores**: Los códigos HEX están predefinidos en `categorias_denuncias` y se usan en el frontend para UI consistency.

---

## 🤝 Soporte

Para preguntas o cambios en la estructura:
1. Hacer backup antes de cambios
2. Probar en ambiente local
3. Documentar cambios en este archivo

**Última actualización**: 27 de noviembre de 2025
