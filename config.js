/* ===== Ahorro Inteligente · conexión con tu proyecto de Supabase =====
   1) En Supabase abre tu proyecto → botón "Connect" (o Project Settings → API Keys).
   2) Copia la "Project URL" y la clave pública ("publishable" sb_publishable_… o la "anon" antigua).
   3) Pégalas abajo, entre las comillas, y sube este archivo a GitHub.

   Esa clave es pública por diseño: lo que protege los datos son las reglas (RLS) del archivo supabase.sql.
   NUNCA pongas aquí la clave "secret" ni la "service_role".
   Si dejas los dos campos vacíos, la app funciona sin cuenta y guarda solo en el dispositivo. */
window.AHORRO_CONFIG = {
  supabaseUrl: '',   // ej. 'https://abcdxyz.supabase.co'
  supabaseKey: '',   // ej. 'sb_publishable_xxx…'
};
