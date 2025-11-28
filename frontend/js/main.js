/* ==================== CONFIG ==================== */
// Le variabili d’ambiente di Vite non sono disponibili qui,
// quindi leggiamo direttamente dal file .env usando una fetch.
// (In produzione, useresti un build step o un server per iniettare le chiavi.)

async function loadEnv() {
    // In dev mode, .env is in root. In prod, we might need a different strategy.
    // For this setup, we assume .env is accessible via relative path for simplicity in dev.
    // Note: Vite doesn't serve .env by default for security.
    // We will hardcode for now or fetch from a backend endpoint if needed.
    // For this demo, let's try to fetch from backend or just use placeholders if fetch fails.

    // Better approach for this structure: Fetch config from backend
    // But since we don't have that endpoint yet, let's try to read from a local json or just assume global vars if injected.

    // FALLBACK: If you are running this locally, you might need to manually input keys here 
    // OR we can create a config.js file that is gitignored.

    // Let's try to fetch a config endpoint we will create on the server.
    let API_URL = (import.meta.env && import.meta.env.VITE_API_URL);
    if (!API_URL) {
        if (window.location.hostname.includes('rivl.club') || window.location.hostname.includes('vercel.app')) {
            API_URL = 'https://rivl.onrender.com';
        } else {
            API_URL = 'http://localhost:3000';
        }
    }
    try {
        // We will add a /api/config endpoint to server.js to serve safe public keys
        const res = await fetch(`${API_URL}/api/config`);
        if (res.ok) return await res.json();
    } catch (e) {
        console.log("Could not fetch config from backend");
    }

    return {
        SUPABASE_URL: '',
        SUPABASE_ANON_KEY: ''
    };
}

/* ==================== SUPABASE ==================== */
let supabaseClient;

/* ==================== METAMASK ==================== */
let provider;   // ethers provider
let signer;     // wallet signer
let userAddress = null;

/* ==================== UI ELEMENTS ==================== */
const connectBtn = document.getElementById('connectWalletBtn');
const walletModal = document.getElementById('walletModal');
const walletStatus = document.getElementById('walletStatus');
const walletConnectBtn = document.getElementById('walletConnectBtn');
const walletCloseBtn = document.getElementById('walletCloseBtn');
const gamesGrid = document.getElementById('gamesGrid');

/* ==================== FUNZIONI ==================== */
async function init() {
    const env = await loadEnv();
    if (env.SUPABASE_URL) {
        supabaseClient = supabase.createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);
    } else {
        console.warn("Supabase keys not found. Login will not work.");
    }
}

/* ---- Connessione MetaMask ---- */
function openWalletModal() {
    walletModal.classList.remove('hidden');
}
function closeWalletModal() {
    walletModal.classList.add('hidden');
}
async function connectMetaMask() {
    if (!window.ethereum) {
        walletStatus.textContent = 'MetaMask non installato.';
        return;
    }
    try {
        provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send('eth_requestAccounts', []);
        signer = await provider.getSigner();
        userAddress = await signer.getAddress();
        walletStatus.textContent = `Connesso: ${userAddress.slice(0, 6)}…${userAddress.slice(-4)}`;
        connectBtn.textContent = 'Wallet: ' + userAddress.slice(0, 6) + '…';
        closeWalletModal();
    } catch (e) {
        walletStatus.textContent = 'Connessione annullata.';
        console.error(e);
    }
}

/* ---- Caricamento giochi ---- */
async function loadGames() {
    // In un’app reale questi dati verrebbero da Supabase.
    // In un’app reale questi dati verrebbero da Supabase.
    window.games = [
        {
            id: 'tug-of-war',
            name: 'Neon Overload',
            desc: 'Premi al momento giusto per battere il bot!',
            img: './assets/tug.png',
            page: '/games/tug-of-war.html'
        },
        {
            id: 'click-frenzy',
            name: 'Click Frenzy',
            desc: 'Clicca il più velocemente possibile in 10 secondi!',
            img: './assets/click.png',
            page: '/games/click-frenzy.html'
        },
        {
            id: 'reaction-test',
            name: 'Reaction Test',
            desc: 'Clicca appena il cerchio diventa rosso.',
            img: './assets/reaction.png',
            page: '/games/reaction-test.html'
        },
        {
            id: 'precision-sniper',
            name: 'Precision Sniper',
            desc: 'Colpisci i bersagli velocemente. Precisione conta!',
            img: 'https://placehold.co/80x80?text=Sniper',
            page: '/games/precision-sniper.html'
        }
    ];

    if (gamesGrid) {
        gamesGrid.innerHTML = window.games.map(g => `
        <div class="game-card glass" data-id="${g.id}">
          <img src="${g.img}" alt="${g.name}" onerror="this.src='https://placehold.co/80x80?text=Game'">
          <h3>${g.name}</h3>
          <p>${g.desc}</p>
          <button class="btn-primary glass joinBtn">Gioca</button>
        </div>
      `).join('');

        // Aggiungi listener ai pulsanti “Gioca”
        document.querySelectorAll('.joinBtn').forEach(btn => {
            btn.addEventListener('click', e => {
                const card = e.target.closest('.game-card');
                const gameId = card.dataset.id;
                startGame(gameId);
            });
        });
    }
}

/* ---- Avvio di un gioco (demo) ---- */
function startGame(gameId) {
    // if (!userAddress) {
    //     alert('Devi prima collegare il wallet.');
    //     openWalletModal();
    //     return;
    // }
    // Qui apriremmo una pagina di gioco o un modal.
    // Per la demo mostriamo solo un alert.
    // alert(`Avvio ${gameId} – il wallet ${userAddress} è pronto!`);
    const game = window.games.find(g => g.id === gameId);
    if (game) {
        window.location.href = game.page;
    }
}

/* ==================== AUTH UI ==================== */
const authModal = document.getElementById('authModal');
const authForm = document.getElementById('authForm');
const authEmail = document.getElementById('authEmail');
const authPassword = document.getElementById('authPassword');
const authSubmitBtn = document.getElementById('authSubmitBtn');
const authSwitchLink = document.getElementById('authSwitchLink');
const authTitle = document.getElementById('authTitle');
const authMessage = document.getElementById('authMessage');
const authCloseBtn = document.getElementById('authCloseBtn');
const nav = document.querySelector('.nav');

let isLoginMode = true;

function openAuthModal() {
    authModal.classList.remove('hidden');
}

function closeAuthModal() {
    authModal.classList.add('hidden');
    authMessage.textContent = '';
}

function toggleAuthMode() {
    isLoginMode = !isLoginMode;
    authTitle.textContent = isLoginMode ? 'Accedi' : 'Registrati';
    authSubmitBtn.textContent = isLoginMode ? 'Login' : 'Registrati';
    document.getElementById('authSwitchText').textContent = isLoginMode ? 'Non hai un account?' : 'Hai già un account?';
    authSwitchLink.textContent = isLoginMode ? 'Registrati' : 'Accedi';
    authMessage.textContent = '';
}

async function handleAuth(e) {
    e.preventDefault();
    const email = authEmail.value;
    const password = authPassword.value;

    authMessage.textContent = 'Caricamento...';
    authMessage.style.color = 'var(--text-muted)';

    try {
        let API_URL = (import.meta.env && import.meta.env.VITE_API_URL);
        if (!API_URL) {
            if (window.location.hostname.includes('rivl.club') || window.location.hostname.includes('vercel.app')) {
                API_URL = 'https://rivl.onrender.com';
            } else {
                API_URL = 'http://localhost:3000';
            }
        }
        const endpoint = isLoginMode ? `${API_URL}/api/auth/login` : `${API_URL}/api/auth/register`;
        const res = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        let data;
        try {
            data = await res.json();
        } catch (e) {
            throw new Error('Risposta del server non valida (non è JSON). Controlla la console del server.');
        }

        if (!res.ok) throw new Error(data.error || 'Errore durante l\'operazione');

        authMessage.textContent = isLoginMode ? 'Login effettuato!' : 'Registrazione completata! Controlla la tua email.';
        authMessage.style.color = 'var(--accent)';

        if (isLoginMode && data.user) {
            setTimeout(closeAuthModal, 1000);
            updateNav(data.user);
        }
    } catch (err) {
        authMessage.textContent = err.message;
        authMessage.style.color = 'var(--primary)';
    }
}

function updateNav(user) {
    // Simple check to update nav if user is logged in
    // In a real app we would persist state
    const loginLink = document.querySelector('a[href="#login"]');
    if (user && !loginLink) {
        // User logged in
        // We could replace "Profilo" with username or similar
    }
}

/* ==================== EVENT LISTENERS ==================== */
if (connectBtn) connectBtn.addEventListener('click', openWalletModal);
if (walletCloseBtn) walletCloseBtn.addEventListener('click', closeWalletModal);
if (walletConnectBtn) walletConnectBtn.addEventListener('click', connectMetaMask);

// Auth listeners
if (authCloseBtn) authCloseBtn.addEventListener('click', closeAuthModal);
if (authSwitchLink) authSwitchLink.addEventListener('click', toggleAuthMode);
if (authForm) authForm.addEventListener('submit', handleAuth);

// Add Login button to Nav
const navLinks = document.querySelector('.nav');
const loginBtn = document.createElement('a');
loginBtn.href = "#";
loginBtn.className = "nav-link";
loginBtn.textContent = "Login";
loginBtn.addEventListener('click', openAuthModal);
navLinks.appendChild(loginBtn);

/* ==================== AVVIO ==================== */
init().then(() => {
    loadGames();
});
