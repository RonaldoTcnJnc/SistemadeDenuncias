import pool from '../db.js';

class Autoridad {
  // Buscar autoridad por email
  static async findByEmail(email) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT * FROM autoridades WHERE email = $1',
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
        'UPDATE autoridades SET ultimo_acceso = CURRENT_TIMESTAMP WHERE id = $1',
        [id]
      );
    } finally {
      client.release();
    }
  }
}

export default Autoridad;