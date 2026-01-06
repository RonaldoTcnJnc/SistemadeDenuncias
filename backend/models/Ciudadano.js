import pool from '../db.js';

class Ciudadano {
  // Crear un nuevo ciudadano
  static async create({ nombre_completo, email, telefono, direccion, password_hash }) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `INSERT INTO ciudadanos
         (nombre_completo, email, telefono, direccion, ciudad, distrito, password_hash, verificado, activo)
         VALUES ($1, $2, $3, $4, $5, $6, $7, true, true)
         RETURNING id, nombre_completo, email, telefono, direccion, ciudad, distrito, fecha_registro, verificado, activo`,
        [nombre_completo, email.toLowerCase(), telefono, direccion, null, null, password_hash]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  // Buscar ciudadano por email
  static async findByEmail(email) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT * FROM ciudadanos WHERE email = $1',
        [email.toLowerCase()]
      );
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }

  // Actualizar último acceso
  static async updateLastAccess(id) {
    const client = await pool.connect();
    try {
      await client.query(
        'UPDATE ciudadanos SET ultimo_acceso = CURRENT_TIMESTAMP WHERE id = $1',
        [id]
      );
    } finally {
      client.release();
    }
  }
}

export default Ciudadano;