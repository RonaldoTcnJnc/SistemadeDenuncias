import express from 'express';
import AuthController from '../controllers/AuthController.js';

const router = express.Router();

// Verificar JWT_SECRET al cargar el módulo
console.log('🔑 JWT_SECRET disponible:', process.env.JWT_SECRET ? '✅ SI' : '❌ NO');
if (!process.env.JWT_SECRET) {
  console.error('⚠️  ADVERTENCIA: JWT_SECRET no está configurado');
}

// ============================================
// 📝 REGISTRO DE CIUDADANO
// ============================================
router.post('/register', AuthController.register);

// ============================================
// 🔐 LOGIN DE CIUDADANO
// ============================================
router.post('/login', AuthController.login);

// ============================================
// 🔐 LOGIN DE AUTORIDAD
// ============================================
router.post('/login/autoridad', AuthController.loginAutoridad);

// ============================================
// 🔍 VERIFICAR TOKEN (RUTA PROTEGIDA EJEMPLO)
// ============================================
router.get('/verify', AuthController.verifyToken);

// ============================================
// 🔍 CONSULTAR DNI
// ============================================
router.get('/consultar-dni', AuthController.consultarDNI);

export default router;