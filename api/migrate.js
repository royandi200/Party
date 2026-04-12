import mysql from 'mysql2/promise';

// ▶️ Llama a este endpoint UNA SOLA VEZ para agregar photo_url a la tabla existente.
// GET /api/migrate  con header  x-setup-token: <tu SETUP_TOKEN>

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-setup-token');
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

  try {
    // Verificar si la columna ya existe
    const [cols] = await conn.execute(`
      SELECT COLUMN_NAME
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'attendees' AND COLUMN_NAME = 'photo_url'
    `, [process.env.DB_NAME]);

    if (cols.length > 0) {
      await conn.end();
      return res.status(200).json({ ok: true, message: 'photo_url ya existe, nada que hacer ✅' });
    }

    // Agregar la columna
    await conn.execute(`
      ALTER TABLE attendees ADD COLUMN photo_url TEXT NULL;
    `);

    await conn.end();
    return res.status(200).json({ ok: true, message: '✅ Columna photo_url agregada exitosamente a la tabla attendees' });
  } catch (err) {
    console.error(err);
    await conn.end();
    return res.status(500).json({ error: 'Error en migración', detail: err.message });
  }
}
