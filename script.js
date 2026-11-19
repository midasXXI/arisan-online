// ===== HARGA AWAL =====
let prices = [
  { pair: 'EUR/USD', symbol: 'EURUSD', price: '1.08450', change: '+0.00%', up: true },
  { pair: 'GBP/USD', symbol: 'GBPUSD', price: '1.26980', change: '+0.00%', up: true },
  { pair: 'USD/JPY', symbol: 'USDJPY', price: '150.250', change: '+0.00%', up: true },
  { pair: 'XAU/USD', symbol: 'XAUUSD', price: '3705.00', change: '+0.00%', up: true },
  { pair: 'BTC/USD', symbol: 'BTCUSD', price: '98450.00', change: '+0.00%', up: true }
];

let lastPrices = {};

// ===== AMBIL HARGA =====
async function fetchPrices() {
  let successCount = 0;

  for (const item of prices) {
    try {
      const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${mapCoinId(item.pair)}&vs_currencies=usd&include_24hr_change=true`);
      if (res.ok) {
        const data = await res.json();
        const coinKey = Object.keys(data)[0];
        const newPrice = parseFloat(data[coinKey].usd);
        
        if (!lastPrices[item.pair]) lastPrices[item.pair] = newPrice;
        const changePct = ((newPrice - lastPrices[item.pair]) / lastPrices[item.pair]) * 100;
        
        item.price = newPrice.toFixed(item.pair.includes('XAU') || item.pair.includes('BTC') ? 2 : 5);
        item.change = (changePct >= 0 ? '+' : '') + changePct.toFixed(3) + '%';
        item.up = changePct >= 0;
        lastPrices[item.pair] = newPrice;
        successCount++;
      }
    } catch (err) {
      simulateSmallChange(item);
    }
  }

  if (successCount === 0) {
    prices.forEach(item => simulateSmallChange(item));
  }

  renderAll();
}

function mapCoinId(pair) {
  if (pair === 'BTC/USD') return 'bitcoin';
  if (pair === 'XAU/USD') return 'gold';
  return '';
}

function simulateSmallChange(item) {
  const current = parseFloat(item.price.replace(',', ''));
  const volatility = item.pair.includes('BTC') ? 0.0005 : 0.0001;
  const change = (Math.random() - 0.5) * 2 * volatility;
  const newPrice = current + change;
  const changePct = (change / current) * 100;
  
  item.price = newPrice.toFixed(item.pair.includes('XAU') || item.pair.includes('BTC') ? 2 : 5);
  item.change = (changePct >= 0 ? '+' : '') + changePct.toFixed(3) + '%';
  item.up = changePct >= 0;
}

// ===== UPDATE KEDUA TEMPAT SEKALIGUS =====
function renderAll() {
  renderPriceCards();
  renderTicker();
}

// Update kotak harga di kanan
function renderPriceCards() {
  const priceItems = document.querySelectorAll('.price-item');
  prices.forEach((item, index) => {
    if (priceItems[index]) {
      const priceEl = priceItems[index].querySelector('.pair-price');
      const changeEl = priceItems[index].querySelector('.pair-change');
      
      if (priceEl) {
        priceEl.style.opacity = '0.5';
        setTimeout(() => {
          priceEl.textContent = item.price;
          priceEl.style.opacity = '1';
        }, 100);
      }
      
      if (changeEl) {
        changeEl.textContent = item.change;
        changeEl.className = `pair-change ${item.up ? 'change-up' : 'change-down'}`;
      }
    }
  });
}

// Update ticker berjalan di bawah
function renderTicker() {
  const tickerSpans = document.querySelectorAll('.ticker span');
  prices.forEach((item, index) => {
    if (tickerSpans[index]) {
      const strongEl = tickerSpans[index].querySelector('strong');
      if (strongEl) {
        const arrow = item.up ? '↑' : '↓';
        strongEl.textContent = `${item.price} ${arrow}`;
      }
    }
  });
}

// ===== JALANKAN =====
fetchPrices();
setInterval(fetchPrices, 5000); // tiap 5 detik update keduanya sekaligus

// Navbar efek saat di-scroll
window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar');
  if (window.scrollY > 50) {
    navbar.style.padding = '12px 0';
    navbar.style.background = 'rgba(5, 12, 26, 0.95)';
  } else {
    navbar.style.padding = '16px 0';
    navbar.style.background = 'rgba(5, 12, 26, 0.85)';
  }
});

// Animasi masuk elemen saat terlihat
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

document.querySelectorAll('.feature-card, .stat-card, .price-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'all 0.6s ease-out';
  observer.observe(el);
});

// ===== MENU MOBILE =====
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

menuToggle.addEventListener('click', () => {
  navLinks.classList.toggle('active');
  menuToggle.classList.toggle('active');
});

document.querySelectorAll('#navLinks a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('active');
    menuToggle.classList.remove('active');
  });
});
