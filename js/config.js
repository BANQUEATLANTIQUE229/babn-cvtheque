// ============================================================
// CONFIGURATION SUPABASE — À REMPLIR
// ============================================================
// 1. Va sur https://supabase.com, crée un projet gratuit
// 2. Dans le tableau de bord du projet : Project Settings > API
// 3. Copie "Project URL" et colle-le dans SUPABASE_URL ci-dessous
// 4. Copie la clé "anon public" et colle-la dans SUPABASE_ANON_KEY
// ============================================================

const SUPABASE_URL = "https://bbfdvjyyuyavhzzwsmqw.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_PM8R_wCqZI9EFTVRF1ruKQ_YFPlza0u";

// Ne pas modifier en dessous de cette ligne
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
