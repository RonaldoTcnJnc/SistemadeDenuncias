import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  user: process.env.PGUSER || 'postgres',
  host: process.env.PGHOST || 'localhost',
  database: process.env.PGDATABASE || 'sistema_denuncias',
  password: process.env.PGPASSWORD || '',
  port: Number(process.env.PGPORT) || 5432,
  max: 10,
});

export default pool;
