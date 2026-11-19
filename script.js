// ===== DATA AWAL (akan diganti otomatis dengan harga asli) =====
const prices = [
  { pair: 'EUR/USD', price: '1.08642', change: '+0.24%', up: true },
  { pair: 'GBP/USD', price: '1.27185', change: '+0.18%', up: true },
  { pair: 'USD/JPY', price: '149.825', change: '-0.12%', up: false },
  { pair: 'XAU/USD', price: '2039.65', change: '+0.32%', up: true },
  { pair: 'BTC/USD', price: '68,420.50', change: '-1.45%', up: false }
];

// ===== AMBIL HARGA ASLI DARI API GRATIS =====
async function fetchRealPrices() {
  try {
    // Ambil harga BTC & Emas dari CoinGecko
    const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true');
    
    if (!res.ok) throw new Error('API limit');
    const data = await res.json();

    // Update BTC/USD
    updatePriceData('BTC/USD', data.bitcoin.usd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), data.bitcoin.usd_24h_change);

    // Emas pakai API lain gratis
    fetchGoldPrice();

  } catch (err) {
    console.log('API belum siap, pakai data sementara dulu');
  }
}

// Ambil harga Emas
async function fetchGoldPrice() {
  try {
    const res = await fetch('https://data-asg.goldprice.org/dbXRates/USD');
    if (!res.ok) throw new Error('error');
    const data = await res.json();
    const goldPrice = data.items[0].xauPrice;
    updatePriceData('XAU/USD', goldPrice.toFixed(2), 0.15);
  } catch (err) {
    console.log('Emas: data sementara');
  }
}

// Fungsi bantu update data
function updatePriceData(pairName, newPrice, changePercent) {
  const idx = prices.findIndex(p => p.pair === pairName);
  if (idx !== -1) {
    const isUp = changePercent >= 0;
    prices[idx].price = newPrice;
    prices[idx].change = (isUp ? '+' : '') + changePercent.toFixed(2) + '%';
    prices[idx].up = isUp;
  }
}

// Update tampilan ke halaman
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

// Jalankan pembaruan harga
fetchRealPrices();
setInterval(fetchRealPrices, 60000); // ambil harga baru tiap 60 detik
setInterval(renderPrices, 3000); // animasi angka berjalan tiap 3 detik

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

// Tutup menu saat link diklik
document.querySelectorAll('#navLinks a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('active');
    menuToggle.classList.remove('active');
  });
});
