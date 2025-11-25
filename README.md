# Minigame Arena

Piattaforma di minigiochi competitivi con sistema pay-to-play.

## 🎮 Giochi Disponibili
- **Tiro alla fune**: Gioco di velocità basato sui click
- **Missione Outdoor**: Sfide basate su geolocalizzazione

## 🛠️ Tecnologie
- **Frontend**: HTML, CSS, JavaScript (Vite)
- **Backend**: Node.js, Express
- **Database**: Supabase (PostgreSQL)
- **Pagamenti**: Stripe
- **Wallet**: MetaMask (ethers.js)

## 📦 Installazione Locale

```bash
# Clona il repository
git clone https://github.com/TUO-USERNAME/minigame-arena.git
cd minigame-arena

# Installa le dipendenze
npm install

# Crea il file .env con le tue chiavi
cp .env.example .env
# Modifica .env con le tue chiavi reali

# Avvia il progetto
npm run dev
```

## 🌐 Deployment

### Frontend (Vercel/Netlify)
- Build command: `npm run build`
- Output directory: `dist`

### Backend (Render/Railway)
- Start command: `node server/server.js`
- Port: 3000

## 📝 Variabili d'Ambiente

```
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

## 📄 Licenza
MIT
