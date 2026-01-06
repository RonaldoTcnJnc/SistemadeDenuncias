import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Ciudadano from '../models/Ciudadano.js';
import Autoridad from '../models/Autoridad.js';

class AuthController {
  // Registro de ciudadano
  static async register(req, res) {
    try {
      const { nombre_completo, email, telefono, direccion, password } = req.body;

      // Validaciones básicas
      if (!nombre_completo || !email || !password) {
        return res.status(400).json({
          error: 'Faltan campos requeridos',
          required: ['nombre_completo', 'email', 'password']
        });
      }

      // Verificar si el email ya existe
      const existingUser = await Ciudadano.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({
          error: 'El email ya está registrado'
        });
      }

      // Hashear contraseña
      const saltRounds = 10;
      const password_hash = await bcrypt.hash(password, saltRounds);

      // Crear ciudadano
      const newUser = await Ciudadano.create({
        nombre_completo,
        email,
        telefono,
        direccion,
        password_hash
      });

      // Generar token JWT
      const token = jwt.sign(
        {
          id: newUser.id,
          email: newUser.email,
          tipo: 'ciudadano'
        },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      console.log(`✅ Nuevo ciudadano registrado: ${newUser.email}`);

      res.status(201).json({
        success: true,
        message: 'Usuario registrado exitosamente',
        user: newUser,
        token
      });

    } catch (error) {
      console.error('❌ Error en registro:', error);
      res.status(500).json({
        error: 'Error al registrar usuario',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Login de ciudadano
  static async login(req, res) {
    try {
      const { email, password } = req.body;

      // Validaciones
      if (!email || !password) {
        return res.status(400).json({
          error: 'Email y contraseña son requeridos'
        });
      }

      // Buscar usuario
      const user = await Ciudadano.findByEmail(email);
      if (!user) {
        return res.status(401).json({
          error: 'Credenciales inválidas'
        });
      }

      // Verificar si está activo
      if (!user.activo) {
        return res.status(403).json({
          error: 'Cuenta desactivada. Contacta al administrador'
        });
      }

      // Verificar contraseña
      const validPassword = await bcrypt.compare(password, user.password_hash);
      if (!validPassword) {
        return res.status(401).json({
          error: 'Credenciales inválidas'
        });
      }

      // Actualizar último acceso
      await Ciudadano.updateLastAccess(user.id);

      // Generar token JWT
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          tipo: 'ciudadano'
        },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      // No enviar el hash de contraseña
      delete user.password_hash;

      console.log(`✅ Login exitoso: ${user.email}`);

      res.json({
        success: true,
        message: 'Login exitoso',
        user,
        token
      });

    } catch (error) {
      console.error('❌ Error en login:', error);
      res.status(500).json({
        error: 'Error al iniciar sesión',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Login de autoridad
  static async loginAutoridad(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          error: 'Email y contraseña son requeridos'
        });
      }

      const autoridad = await Autoridad.findByEmail(email);
      if (!autoridad) {
        return res.status(401).json({
          error: 'Credenciales inválidas'
        });
      }

      if (!autoridad.activo) {
        return res.status(403).json({
          error: 'Cuenta desactivada. Contacta al administrador'
        });
      }

      const validPassword = await bcrypt.compare(password, autoridad.contraseña_hash);
      if (!validPassword) {
        return res.status(401).json({
          error: 'Credenciales inválidas'
        });
      }

      // Actualizar último acceso
      await Autoridad.updateLastAccess(autoridad.id);

      const token = jwt.sign(
        {
          id: autoridad.id,
          email: autoridad.email,
          rol: autoridad.rol,
          tipo: 'autoridad'
        },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      delete autoridad.contraseña_hash;

      console.log(`✅ Login autoridad exitoso: ${autoridad.email} (${autoridad.rol})`);

      res.json({
        success: true,
        message: 'Login exitoso',
        autoridad,
        token
      });

    } catch (error) {
      console.error('❌ Error en login autoridad:', error);
      res.status(500).json({
        error: 'Error al iniciar sesión',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Verificar token
  static async verifyToken(req, res) {
    try {
      const token = req.headers.authorization?.split(' ')[1];

      if (!token) {
        return res.status(401).json({
          error: 'Token no proporcionado'
        });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      res.json({
        success: true,
        message: 'Token válido',
        user: decoded
      });

    } catch (error) {
      res.status(401).json({
        error: 'Token inválido o expirado'
      });
    }
  }

  // Consultar DNI
  static async consultarDNI(req, res) {
    const { dni } = req.query;

    // Validar DNI
    if (!dni || !/^\d{8}$/.test(dni)) {
      return res.status(400).json({
        error: 'DNI inválido. Debe ser 8 dígitos numéricos.'
      });
    }

    try {
      console.log('🔍 Consultando DNI en backend:', dni);

      // API gratuita: Graph Peru (sin token)
      const response = await fetch(`https://graphperu.daustinn.com/api/query/${dni}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'SistemaDenuncias/1.0'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error de API externa:', response.status, errorText);
        return res.status(response.status).json({
          error: `Error de API externa: ${response.status}`
        });
      }

      const data = await response.json();
      console.log('✅ Datos obtenidos de API:', data);

      // Devolver los datos crudos para que el frontend los procese
      res.json(data);

    } catch (error) {
      console.error('❌ Error al consultar DNI:', error);
      res.status(500).json({
        error: 'Error interno del servidor al consultar DNI'
      });
    }
  }
}

export default AuthController;