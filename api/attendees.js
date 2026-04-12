import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host:     process.env.DB_HOST,
  port:     parseInt(process.env.DB_PORT || '3306'),
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 5,
  ssl: false
});

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    if (req.method === 'GET') {
      const [rows] = await pool.query(
        'SELECT * FROM attendees ORDER BY created_at ASC'
      );
      return res.status(200).json(rows);
    }

    if (req.method === 'POST') {
      const { name, instagram, gender, zone, seat } = req.body;

      if (!name || !instagram || !gender || !zone || !seat)
        return res.status(400).json({ error: 'Faltan campos obligatorios' });

      // Verificar que el puesto no esté ocupado
      const [existing] = await pool.query(
        'SELECT id FROM attendees WHERE seat = ?', [seat]
      );
      if (existing.length > 0)
        return res.status(409).json({ error: 'Puesto ya ocupado' });

      await pool.query(
        'INSERT INTO attendees (name, instagram, gender, zone, seat) VALUES (?, ?, ?, ?, ?)',
        [name, instagram, gender, zone, seat]
      );
      return res.status(201).json({ ok: true });
    }

    return res.status(405).json({ error: 'Método no permitido' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error de base de datos', detail: err.message });
  }
}
