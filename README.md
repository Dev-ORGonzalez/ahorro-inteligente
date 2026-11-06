# Ahorro Inteligente · Guía para publicarla con login

Tiempo aproximado: 15–20 minutos. Solo se hace una vez.

## Qué hay en esta carpeta

| Archivo | Para qué sirve |
|---|---|
| `index.html` | La app completa |
| `config.js` | Aquí pegas los datos de tu proyecto de Supabase |
| `manifest.webmanifest`, `sw.js`, `icons/` | Para instalarla en el iPhone como app y que abra sin internet |
| `supabase.sql` | Crea la tabla y las reglas de seguridad por usuario |
| `.nojekyll` | Evita que GitHub Pages ignore archivos |

---

## Paso 1 · Crear el proyecto en Supabase

1. Entra a **supabase.com** → *Start your project* → crea una cuenta (puedes usar tu GitHub Dev-ORGonzalez).
2. **New project**: nombre `ahorro-inteligente`, una contraseña de base de datos fuerte (guárdala), región la más cercana (por ejemplo *East US*). Plan **Free**.
3. Espera 1–2 minutos a que termine de crearse.

## Paso 2 · Crear la tabla y las reglas de seguridad

1. Menú izquierdo → **SQL Editor** → **New query**.
2. Abre `supabase.sql`, copia todo, pégalo y toca **Run**.
3. Abajo debe salir `docs | true` (la seguridad por filas quedó activa).

Con esto, cada cuenta solo puede leer, crear, cambiar y borrar **sus propias filas**. Lo bloquea la base de datos, no solo la app.

## Paso 3 · Configurar el login por correo

**Authentication → Sign In / Providers → Email**
- *Enable Email provider*: activado.
- *Confirm email*: activado (así se comprueba que el correo es de quien se registra).
- *Minimum password length*: 8.

**Authentication → Emails (Templates)** — para que el correo traiga el código de 6 dígitos:
- **Confirm signup**: agrega en el cuerpo `Tu código es: <b>{{ .Token }}</b>` (puedes dejar el enlace también).
- **Magic Link**: agrega `Tu código para entrar es: <b>{{ .Token }}</b>`.

**Authentication → URL Configuration**
- *Site URL*: `https://dev-orgonzalez.github.io/ahorro-inteligente/`
- *Redirect URLs*: agrega esa misma dirección.

## Paso 4 · Copiar tus claves a `config.js`

1. En Supabase toca **Connect** (arriba) o **Project Settings → API Keys**.
2. Copia la **Project URL** y la clave **publishable** (`sb_publishable_…`) o la **anon** antigua.
3. Pégalas en `config.js`:

```js
window.AHORRO_CONFIG = {
  supabaseUrl: 'https://TU-PROYECTO.supabase.co',
  supabaseKey: 'sb_publishable_…',
};
```

> Esa clave es pública por diseño (va en el navegador). Lo que protege los datos son las reglas del Paso 2.
> **Nunca** pongas la clave `secret` ni la `service_role`.

## Paso 5 · Publicar en GitHub Pages

1. En GitHub crea un repositorio nuevo llamado **`ahorro-inteligente`** (público; GitHub Pages gratis lo requiere).
2. **Add file → Upload files** → arrastra **todo lo de esta carpeta** (incluida la carpeta `icons`) → *Commit changes*.
3. **Settings → Pages** → *Source*: **Deploy from a branch** → Branch **main**, carpeta **/ (root)** → Save.
4. En 1–2 minutos queda en: **https://dev-orgonzalez.github.io/ahorro-inteligente/**

## Paso 6 · Instalarla en el iPhone

1. Abre esa dirección en **Safari**.
2. Toca **Compartir** → **Agregar a pantalla de inicio** → *Agregar*.
3. Ábrela desde el ícono de la alcancía y crea tu cuenta.

## Paso 7 · Pasar tus datos actuales

Tus datos de hoy viven en la versión de claude.ai o en el archivo HTML, que son otros "lugares" del navegador. Para traerlos:

1. En la versión vieja: **Ajustes → Descargar respaldo** (o **Copiar datos**).
2. En la nueva, ya con tu cuenta: **Ajustes → Restaurar** (el archivo) o **Pegar datos** (el texto).
3. Espera el aviso **Guardado en tu cuenta**. Desde ahí lo ves igual en el iPhone y en la computadora.

---

## Cuando cambies algo en la app

Sube el `index.html` nuevo y, en `sw.js`, cambia la línea `const VERSION = 'ahorro-…'` (por ejemplo, súmale 1 al final). Así el iPhone baja la versión nueva la próxima vez que la abras con internet.

## Cosas que conviene saber (plan gratis de Supabase)

- **Pausa por inactividad**: los proyectos gratis se pausan si casi no tienen actividad durante 7 días. Usarla a diario lo evita. Si se pausa, en el Dashboard tocas *Resume project* y vuelve con todos los datos.
- **Correos limitados**: el servicio de correo incluido solo manda unos pocos por hora. Para ti alcanza. Si invitas a muchas personas, configura un SMTP propio (por ejemplo Brevo o Resend) en *Authentication → Emails → SMTP Settings*.
- **El código del correo** vence en 1 hora y se puede pedir uno nuevo cada 60 segundos.
- **Privacidad**: ningún usuario puede ver los datos de otro desde la app. Tú, como dueño del proyecto, sí podrías verlos en el Dashboard de Supabase; si la compartes con otras personas, díselo.
- **Cerrar sesión** borra la copia del dispositivo (tus datos quedan en la cuenta). Si cierras sesión sin internet, pierdes lo que no se haya subido; la app te avisa antes.
