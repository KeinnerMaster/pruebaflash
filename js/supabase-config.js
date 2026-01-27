// Configuración de Supabase
const SUPABASE_URL = 'https://wjvhvcwnkawjtreavirm.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indqdmh2Y3dua2F3anRyZWF2aXJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkyNzA0MTQsImV4cCI6MjA4NDg0NjQxNH0.gKj9eBsXKoJG5PePRZyt-Vm8oQfbYXKOb77biE32nxg';

// Cliente de Supabase (usando la librería cargada vía CDN)
let supabase;

if (typeof supabasejs !== 'undefined') {
    supabase = supabasejs.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} else {
    console.error('Supabase library not loaded. Make sure to include <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>');
}

// Exportar para uso global
window.supabase = supabase;
