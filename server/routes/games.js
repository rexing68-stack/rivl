const router = require('express').Router();
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);

// Lista dei giochi disponibili (statico per ora)
router.get('/', async (req, res) => {
    const games = [
        { id: 'tug-of-war', name: 'Tiro alla fune', description: 'Clicca più velocemente!' },
        { id: 'outdoor-mission', name: 'Missione Outdoor', description: 'Raggiungi 500 m e scansiona l’oggetto.' },
    ];
    res.json(games);
});

// Endpoint per registrare un risultato di partita
router.post('/result', async (req, res) => {
    const { gameId, playerId, score, paymentSessionId } = req.body;
    // Salviamo il risultato nella tabella “matches”
    const { data, error } = await supabase.from('matches').insert({
        game_id: gameId,
        player_id: playerId,
        score,
        payment_session_id: paymentSessionId,
    });
    if (error) return res.status(400).json({ error: error.message });
    res.json({ message: 'Risultato salvato', data });
});

module.exports = router;
