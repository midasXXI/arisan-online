// ===== DATA HARGA AWAL (SIMULASI DULU) =====
let prices = [
    { pair: 'EUR/USD', price: '1.08450', change: '+0.00%', up: true },
    { pair: 'GBP/USD', price: '1.26980', change: '+0.00%', up: true },
    { pair: 'USD/JPY', price: '150.250', change: '+0.00%', up: true },
    { pair: 'XAU/USD', price: '3705.00', change: '+0.00%', up: true },
    { pair: 'BTC/USD', price: '98450.00', change: '+0.00%', up: true }
];

// ===== FUNGSI: UPDATE HARGA SETIAP DETIK =====
function updatePricesEverySecond() {
    prices.forEach(item => {
        const current = parseFloat(item.price.replace(/,/g, ''));
        
        let step;
        if (item.pair === 'BTC/USD') step = (Math.random() - 0.5) * 8;
        else if (item.pair === 'XAU/USD') step = (Math.random() - 0.5) * 1.5;
        else if (item.pair === 'USD/JPY') step = (Math.random() - 0.5) * 0.015;
        else step = (Math.random() - 0.5) * 0.00015;

        const newPrice = current + step;
        const isUp = step >= 0;
        
        if (item.pair === 'BTC/USD' || item.pair === 'XAU/USD') {
            item.price = newPrice.toFixed(2);
        } else if (item.pair === 'USD/JPY') {
            item.price = newPrice.toFixed(3);
        } else {
            item.price = newPrice.toFixed(5);
        }
        
        item.up = isUp;
        item.change = (isUp ? '+' : '') + (step / current * 100).toFixed(4) + '%';
    });

    renderAll();
}

// ===== RENDER KE SEMUA TEMPAT =====
function renderAll() {
    renderTicker();
    renderPriceCards();
}

// 1️⃣ Ticker berjalan di bawah
function renderTicker() {
    const ticker = document.getElementById('ticker');
    let html = '';
    prices.forEach(item => {
        html += `
            <div class="ticker-item">
                <span class="ticker-pair">${item.pair}</span>
                <span class="ticker-price">${item.price}</span>
                <span class="ticker-change ${item.up ? 'change-up' : 'change-down'}">
                    ${item.up ? '↑' : '↓'} ${item.change}
                </span>
            </div>
        `;
    });
    ticker.innerHTML = html + html; // duplikat supaya mulus
}

// 2️⃣ Kartu harga di bagian tengah
function renderPriceCards() {
    const grid = document.getElementById('pricesGrid');
    grid.innerHTML = '';
    prices.forEach(item => {
        grid.innerHTML += `
            <div class="price-card">
                <div class="price-pair">${item.pair}</div>
                <div class="price-value">${item.price}</div>
                <div class="${item.up ? 'change-up' : 'change-down'}">
                    ${item.up ? '↑' : '↓'} ${item.change}
                </div>
            </div>
        `;
    });
}

// ===== NAVBAR MOBILE =====
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

document.querySelectorAll('#navLinks a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});

// ===== LIVE CHAT =====
const chatBtn = document.getElementById('chatBtn');
const chatBox = document.getElementById('chatBox');
const chatClose = document.getElementById('chatClose');
const chatInput = document.getElementById('chatInput');
const chatSend = document.getElementById('chatSend');
const chatMessages = document.getElementById('chatMessages');

chatBtn.addEventListener('click', () => {
    chatBox.classList.add('active');
});

chatClose.addEventListener('click', () => {
    chatBox.classList.remove('active');
});

function kirimPesan() {
    const teks = chatInput.value.trim();
    if (!teks) return;
    
    chatMessages.innerHTML += `
        <div class="chat-msg msg-user">${teks}</div>
    `;
    chatInput.value = '';
    
    // Balasan otomatis
    setTimeout(() => {
        chatMessages.innerHTML += `
            <div class="chat-msg msg-bot">Terima kasih! Silakan daftar akun di link di atas ya, atau hubungi WhatsApp kami untuk bantuan lebih lanjut.</div>
        `;
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 800);
    
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

chatSend.addEventListener('click', kirimPesan);
chatInput.addEventListener('keypress', e => {
    if (e.key === 'Enter') kirimPesan();
});

// ===== MULAI JALANKAN =====
updatePricesEverySecond();
setInterval(updatePricesEverySecond, 1000);

// TODO: NANTI GANTI BAGIAN DI ATAS DENGAN DATA DARI API EXNESS
// Cukup ganti isi variabel prices[] saja, tampilannya otomatis ikut
