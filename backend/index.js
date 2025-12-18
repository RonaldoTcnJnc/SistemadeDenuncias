import express from 'express';
import dotenv from 'dotenv';
import pool from './db.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

// Configurar CORS manualmente (sin dependencias adicionales)
app.use((req, res, next) => {
  const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    process.env.FRONTEND_URL
  ].filter(Boolean);

  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Manejar preflight requests
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  next();
});

app.use(express.json({ limit: '10mb' }));

app.get('/api/health', (req, res) => res.json({ ok: true, time: new Date() }));

// --- SETUP DATABASE ENDPOINT (TEMPORAL) ---
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.get('/api/db-init', async (req, res) => {
  try {
    const sqlPath = path.join(__dirname, '..', 'database', 'init.sql');

    // 1. Check file existence
    if (!fs.existsSync(sqlPath)) {
      return res.status(404).json({ error: 'init.sql not found', path: sqlPath });
    }

    // 2. Test DB Connection
    try {
      await pool.query('SELECT NOW()');
    } catch (dbErr) {
      return res.status(500).json({
        error: 'Database connection failed',
        details: JSON.stringify(dbErr, Object.getOwnPropertyNames(dbErr))
      });
    }

    // 3. Execute SQL
    let sql = fs.readFileSync(sqlPath, 'utf8');
    // Remove BOM (Byte Order Mark) if present - fixes "syntax error at or near... "
    sql = sql.replace(/^\uFEFF/, '');

    await pool.query(sql);

    res.json({ success: true, message: 'Database initialized successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Initialization failed',
      details: JSON.stringify(err, Object.getOwnPropertyNames(err)),
      message: err.message
    });
  }
});
// ------------------------------------------

// Obtener denuncias
app.get('/api/denuncias', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, titulo, descripcion, categoria, ubicacion, distrito, estado, fecha_reporte FROM denuncias ORDER BY fecha_reporte DESC LIMIT 100');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener denuncias' });
  }
});

// Crear nueva denuncia (simple)
app.post('/api/denuncias', async (req, res) => {
  try {
    const { ciudadano_id, titulo, descripcion, categoria, ubicacion, latitud, longitud, distrito, prioridad } = req.body;
    const q = `INSERT INTO denuncias (ciudadano_id, titulo, descripcion, categoria, ubicacion, latitud, longitud, distrito, prioridad) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`;
    const values = [ciudadano_id || null, titulo, descripcion, categoria, ubicacion, latitud || null, longitud || null, distrito || null, prioridad || 'Media'];
    const result = await pool.query(q, values);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear denuncia' });
  }
});

// Obtener ciudadanos
app.get('/api/ciudadanos', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, nombre_completo, email, telefono, ciudad, distrito, fecha_registro FROM ciudadanos ORDER BY fecha_registro DESC LIMIT 100');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener ciudadanos' });
  }
});

// Obtener autoridades
app.get('/api/autoridades', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, nombre_completo, email, departamento, cargo, rol, distrito_asignado FROM autoridades ORDER BY nombre_completo');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener autoridades' });
  }
});

// Endpoint simple para asignar denuncia (crea registro en asignacion_denuncia)
app.post('/api/asignar', async (req, res) => {
  try {
    const { denuncia_id, autoridad_id, notas_internas } = req.body;
    const q = `INSERT INTO asignacion_denuncia (denuncia_id, autoridad_id, notas_internas) VALUES ($1,$2,$3) RETURNING *`;
    const result = await pool.query(q, [denuncia_id, autoridad_id, notas_internas || null]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al asignar denuncia' });
  }
});

app.listen(PORT, () => console.log(`Backend escuchando en http://localhost:${PORT}`));
