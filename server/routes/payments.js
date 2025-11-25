const router = require('express').Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Crea una sessione di checkout (quota di ingresso)
router.post('/create-checkout', async (req, res) => {
    const { gameId, amountCents, playerId } = req.body; // amount in cent (es. 500 = €5

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
            {
                price_data: {
                    currency: 'eur',
                    product_data: { name: `Quota per ${gameId}` },
                    unit_amount: amountCents,
                },
                quantity: 1,
            },
        ],
        mode: 'payment',
        success_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/game/${gameId}?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/game/${gameId}?canceled=1`,
        metadata: { playerId, gameId },
    });

    res.json({ url: session.url });
});

module.exports = router;
