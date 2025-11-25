const router = require('express').Router();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);

// Registrazione
router.post('/register', async (req, res) => {
    const { email, password } = req.body;
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return res.status(400).json({ error: error.message });
    res.json({ message: 'Registrazione avvenuta', user: data.user });
});

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return res.status(400).json({ error: error.message });
    // Restituiamo il JWT per le chiamate future
    res.json({
        message: 'Login ok',
        access_token: data.session.access_token,
        user: data.user,
    });
});

module.exports = router;
