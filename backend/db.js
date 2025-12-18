import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

console.log('--- DEBUG: DB CONNECTION ---');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('DATABASE_URL Type:', typeof process.env.DATABASE_URL);
console.log('DATABASE_URL Value (Head):', process.env.DATABASE_URL ? process.env.DATABASE_URL.substring(0, 15) + '...' : 'UNDEFINED');
console.log('----------------------------');

const isProduction = process.env.NODE_ENV === 'production';

// Configuración flexible: usa DATABASE_URL (Render/Railway/Heroku) o variables individuales
const connectionConfig = process.env.DATABASE_URL
  ? {
    connectionString: process.env.DATABASE_URL,
    ssl: isProduction ? { rejectUnauthorized: false } : false
  }
  : {
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
    ssl: false
  };

const pool = new Pool(connectionConfig);

export default pool;
