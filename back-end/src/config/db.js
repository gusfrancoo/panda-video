import { databaseUrl } from './index.js';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: databaseUrl,
});

export function query(text, params) { 
    return pool.query(text, params); 
}