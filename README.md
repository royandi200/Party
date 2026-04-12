# GuataParty 🛥️

App de registro en tiempo real para el evento en el Yate Majestic — Represa Guatapé.

## Setup Supabase (5 minutos)

### 1. Crear proyecto
1. Entra a [supabase.com](https://supabase.com) y crea un proyecto nuevo
2. Anota el nombre del proyecto

### 2. Crear la tabla `attendees`

En tu proyecto Supabase ve a **SQL Editor** y pega esto:

```sql
create table attendees (
  id          uuid default gen_random_uuid() primary key,
  created_at  timestamptz default now(),
  name        text not null,
  instagram   text not null,
  gender      text not null check (gender in ('male', 'female')),
  zone        text not null check (zone in ('vip', 'main', 'lower')),
  seat        text not null unique
);

-- Habilitar Row Level Security
alter table attendees enable row level security;

-- Permitir lectura pública (para que todos vean el mapa en tiempo real)
create policy "read_all" on attendees for select using (true);

-- Permitir inserción pública (para que se puedan registrar)
create policy "insert_all" on attendees for insert with check (true);
```

### 3. Obtener credenciales

En Supabase ve a **Settings → API** y copia:
- `Project URL` → es tu `SUPABASE_URL`
- `anon public` key → es tu `SUPABASE_ANON_KEY`

### 4. Insertar credenciales en el HTML

Abre `party-app.html` y reemplaza las dos líneas al inicio del `<script>`:

```js
window.SUPABASE_URL  = 'https://xxxx.supabase.co';   // ← tu URL
window.SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIs...';    // ← tu anon key
```

> **Nota:** La `anon key` es segura para poner en el frontend — Supabase la diseñó para eso.
> Solo da acceso a lo que las políticas RLS permitan.

### 5. Deploy
Haz push y Vercel redeploya automáticamente. ✨

---

## Configuración del evento

| Variable | Valor actual | Dónde cambiarla |
|---|---|---|
| Cupos totales | 35 | `const TOTAL = 35` en el JS |
| Cupos VIP | 8 | `const VIP_SEATS = 8` |
| Códigos VIP | GUATA2025, AIRA2025, VIPNIGHT, YACHTVIP | `const VIP_CODES = [...]` |

## Características

- 🟢 **Tiempo real** — todos los dispositivos se sincronizan instantáneamente
- 🛥️ **Mapa visual** del yate con ocupación en vivo
- 🔑 **Código de invitación** para zona VIP
- 📸 **Instagram obligatorio** para el registro
- 📊 **Stats en tiempo real** — hombres, mujeres, disponibles
