# GuataParty 🛥️

App de registro en tiempo real · Yate Majestic · Represa Guatapé

## Arquitectura

```
Navegador (Vercel) ──► /api/attendees (Serverless Function) ──► MySQL en VPS
```

## Variables de entorno en Vercel

En tu proyecto de Vercel → **Settings → Environment Variables** agrega:

| Variable | Ejemplo | Descripción |
|---|---|---|
| `DB_HOST` | `162.214.224.213` | IP de tu VPS |
| `DB_PORT` | `3306` | Puerto MySQL (default) |
| `DB_USER` | `root` | Usuario MySQL |
| `DB_PASSWORD` | `tu_password` | Contraseña MySQL |
| `DB_NAME` | `guataparty` | Nombre de la base de datos |
| `SETUP_TOKEN` | `cualquier_clave_secreta` | Para proteger el endpoint de setup |

## Crear la tabla MySQL en tu VPS

### Opción A — Llamar al endpoint de setup (una sola vez)

Después de hacer deploy en Vercel, llama:

```bash
curl -X POST https://TU-APP.vercel.app/api/setup \
  -H "x-setup-token: TU_SETUP_TOKEN"
```

Esto crea la tabla automáticamente. ✅

### Opción B — SQL manual en el VPS

```sql
CREATE DATABASE IF NOT EXISTS guataparty CHARACTER SET utf8mb4;
USE guataparty;

CREATE TABLE IF NOT EXISTS attendees (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  created_at DATETIME DEFAULT NOW(),
  name       VARCHAR(120) NOT NULL,
  instagram  VARCHAR(80)  NOT NULL,
  gender     ENUM('male','female') NOT NULL,
  zone       ENUM('vip','main','lower') NOT NULL,
  seat       VARCHAR(10)  NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

## Abrir puerto MySQL en el VPS

Para que Vercel pueda conectarse, abre el puerto 3306:

```bash
# UFW (Ubuntu)
ufw allow 3306/tcp
ufw reload

# iptables
iptables -A INPUT -p tcp --dport 3306 -j ACCEPT
```

> ⚠️ Si prefieres seguridad máxima, crea un usuario MySQL que solo acepte
> conexiones desde las IPs de Vercel. Ver: https://vercel.com/docs/edge-network/regions

## Configuración del evento

| Parámetro | Valor | Dónde cambiarlo |
|---|---|---|
| Cupos totales | 35 | `const TOTAL` en party-app.html |
| Cupos VIP | 8 | `const VIP_SEATS` |
| Códigos VIP | GUATA2025, AIRA2025... | `const VIP_CODES` |
| Polling interval | 8 segundos | `const POLL_INTERVAL` |
