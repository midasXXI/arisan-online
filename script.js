// ===== HARGA AWAL TERBARU PER 19 NOVEMBER 2026 =====
let prices = [
  { pair: 'EUR/USD', price: '1.08450', change: '+0.12%', up: true },
  { pair: 'GBP/USD', price: '1.26980', change: '-0.08%', up: false },
  { pair: 'USD/JPY', price: '150.250', change: '+0.20%', up: true },
  { pair: 'XAU/USD', price: '3705.00', change: '+0.15%', up: true },
  { pair: 'BTC/USD', price: '98450.00', change: '+2.35%', up: true }
];

// ===== AMBIL HARGA ASLI DARI API GRATIS =====
async function fetchRealPrices() {
  try {
    // BTC/USD dari CoinGecko
    const resBTC = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true');
    if (resBTC.ok) {
      const dataBTC = await resBTC.json();
      updatePrice('BTC/USD', dataBTC.bitcoin.usd.toFixed(2), dataBTC.bitcoin.usd_24h_change);
    }

    // XAU/USD dari Metals-Live
    const resGold = await fetch('https://api.metals.live/v1/spot/gold');
    if (resGold.ok) {
      const dataGold = await resGold.json();
      updatePrice('XAU/USD', dataGold[0].price.toFixed(2), 0.12);
    }
  } catch (err) {
    console.log('API tidak tersedia, pakai harga terbaru');
  }
}

function updatePrice(pairName, newPrice, changePct) {
  const idx = prices.findIndex(p => p.pair === pairName);
  if (idx !== -1) {
    const isUp = changePct >= 0;
    prices[idx].price = newPrice;
    prices[idx].change = (isUp ? '+' : '') + changePct.toFixed(2) + '%';
    prices[idx].up = isUp;
  }
}

// ===== ANIMASI & TAMPILAN HARGA =====
function renderPrices() {
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
        }, 150);
      }
      
      if (changeEl) {
        changeEl.textContent = item.change;
        changeEl.className = `pair-change ${item.up ? 'change-up' : 'change-down'}`;
      }
    }
  });
}

// Tambah sedikit fluktuasi kecil biar terlihat hidup
function simulateTick() {
  prices.forEach(item => {
    if (!['BTC/USD', 'XAU/USD'].includes(item.pair)) {
      const fluctuation = (Math.random() - 0.5) * 0.0002;
      let current = parseFloat(item.price.replace(',', ''));
      current += fluctuation;
      
      if (item.pair.includes('USD/')) {
        item.price = current.toFixed(3);
      } else if (item.pair.includes('/USD')) {
        item.price = current.toFixed(5);
      }
    }
  });
}

// ===== JALANKAN SEMUA =====
fetchRealPrices();
setInterval(fetchRealPrices, 120000); // ambil harga asli tiap 2 menit
setInterval(() => {
  simulateTick();
  renderPrices();
}, 3000); // update tampilan tiap 3 detik

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
