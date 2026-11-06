/* ===== Ahorro Inteligente - conexion con Supabase =====
   supabaseUrl: la "Project URL" del proyecto.
   supabaseKey: la clave "publishable" (es publica por diseno).
   Los datos los protegen las reglas de supabase.sql.
   NUNCA pongas aqui la clave "secret" ni "service_role". */
window.AHORRO_CONFIG = {
  supabaseUrl: 'https://tyopltavuwfqmgpfcnue.supabase.co',
  supabaseKey: 'sb_publishable_Gkj_ss4eOd1vH2hVhUz6qA_lJAG4qkE',
  loginConCodigo: false,   // true solo si algun dia configuras un SMTP propio
};