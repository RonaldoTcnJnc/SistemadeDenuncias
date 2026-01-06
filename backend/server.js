import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';

dotenv.config();

console.log('🔐 JWT_SECRET cargado:', process.env.JWT_SECRET ? '✅ SI' : '❌ NO');

const app = express();
const PORT = process.env.PORT || 4000;

// Configuración de CORS
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200
};

// Middlewares
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logger middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
});

// Rutas
app.use('/api/auth', authRoutes);

// Ruta raíz
app.get('/', (req, res) => {
  res.json({ 
    message: '🏛️ API Sistema de Denuncias Ciudadanas',
    version: '1.0.0',
    status: 'online',
    endpoints: {
      test: 'GET /api/test',
      register: 'POST /api/auth/register',
      loginCiudadano: 'POST /api/auth/login',
      loginAutoridad: 'POST /api/auth/login/autoridad'
    }
  });
});

// Ruta de prueba
app.get('/api/test', (req, res) => {
  res.json({ 
    message: '✅ Servidor funcionando correctamente',
    timestamp: new Date().toISOString(),
    database: process.env.PGDATABASE || 'DATABASE_URL configurado',
    port: PORT
  });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Ruta no encontrada',
    path: req.path,
    method: req.method
  });
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);
  res.status(500).json({ 
    error: 'Error interno del servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Error procesando solicitud'
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log('\n═══════════════════════════════════════════════');
  console.log('🚀 SERVIDOR BACKEND INICIADO');
  console.log('═══════════════════════════════════════════════');
  console.log(`📡 Puerto: ${PORT}`);
  console.log(`🌐 URL Local: http://localhost:${PORT}`);
  console.log(`🔗 Frontend: ${process.env.FRONTEND_URL}`);
  console.log(`🌍 Entorno: ${process.env.NODE_ENV || 'development'}`);
  console.log('═══════════════════════════════════════════════\n');
});

// Manejo de cierre graceful
process.on('SIGTERM', () => {
  console.log('⚠️ SIGTERM recibido, cerrando servidor...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\n⚠️ SIGINT recibido, cerrando servidor...');
  process.exit(0);
});