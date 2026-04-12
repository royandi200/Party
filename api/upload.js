import { put } from '@vercel/blob';

export const config = {
  api: {
    bodyParser: false, // Necesario para leer multipart/form-data
  },
};

// Parser manual de multipart sin dependencias externas
async function parseMultipart(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', chunk => chunks.push(chunk));
    req.on('end', () => {
      const body = Buffer.concat(chunks);
      const contentType = req.headers['content-type'] || '';
      const boundaryMatch = contentType.match(/boundary=(.+)$/);
      if (!boundaryMatch) return reject(new Error('No boundary found'));

      const boundary = '--' + boundaryMatch[1];
      const parts = body.toString('binary').split(boundary);

      for (const part of parts) {
        if (!part.includes('filename=')) continue;

        const headerEnd = part.indexOf('\r\n\r\n');
        if (headerEnd === -1) continue;

        const headers = part.slice(0, headerEnd);
        const filenameMatch = headers.match(/filename="(.+?)"/);
        const contentTypeMatch = headers.match(/Content-Type: (.+?)\r/);

        if (!filenameMatch) continue;

        const filename = filenameMatch[1];
        const mimeType = contentTypeMatch ? contentTypeMatch[1].trim() : 'image/jpeg';

        // El contenido real empieza después de \r\n\r\n y termina antes de \r\n al final
        const rawContent = part.slice(headerEnd + 4);
        const endTrim = rawContent.endsWith('\r\n') ? rawContent.slice(0, -2) : rawContent;
        const fileBuffer = Buffer.from(endTrim, 'binary');

        return resolve({ filename, mimeType, buffer: fileBuffer });
      }
      reject(new Error('No file found in multipart body'));
    });
    req.on('error', reject);
  });
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    // Verificar que existe el token de Vercel Blob
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return res.status(500).json({
        error: 'BLOB_READ_WRITE_TOKEN no configurado en variables de entorno de Vercel'
      });
    }

    const { filename, mimeType, buffer } = await parseMultipart(req);

    // Sanitizar nombre de archivo
    const ext = filename.split('.').pop().toLowerCase() || 'jpg';
    const safeName = `guataparty/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    // Subir a Vercel Blob
    const blob = await put(safeName, buffer, {
      access: 'public',
      contentType: mimeType,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    return res.status(200).json({ url: blob.url });
  } catch (err) {
    console.error('[upload]', err);
    return res.status(500).json({ error: 'Error subiendo imagen', detail: err.message });
  }
}
