import mysql from 'mysql2/promise';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-setup-token');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.headers['x-setup-token'] !== process.env.SETUP_TOKEN)
    return res.status(401).json({ error: 'No autorizado' });

  const conn = await mysql.createConnection({
    host:     process.env.DB_HOST,
    port:     parseInt(process.env.DB_PORT || '3306'),
    user:     process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: false
  });

  // Crear tabla con photo_url incluido
  await conn.execute(`
    CREATE TABLE IF NOT EXISTS attendees (
      id         INT AUTO_INCREMENT PRIMARY KEY,
      created_at DATETIME DEFAULT NOW(),
      name       VARCHAR(120) NOT NULL,
      instagram  VARCHAR(80)  NOT NULL,
      gender     ENUM('male','female') NOT NULL,
      zone       ENUM('vip','main','lower') NOT NULL,
      seat       VARCHAR(10)  NOT NULL UNIQUE,
      photo_url  TEXT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  await conn.end();
  return res.status(200).json({ ok: true, message: 'Tabla attendees creada ✅ (con photo_url)' });
}
