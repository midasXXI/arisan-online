// ===== HARGA AWAL (akan diganti otomatis) =====
let prices = [
  { pair: 'EUR/USD', symbol: 'EURUSD', price: '1.08450', change: '+0.00%', up: true },
  { pair: 'GBP/USD', symbol: 'GBPUSD', price: '1.26980', change: '+0.00%', up: true },
  { pair: 'USD/JPY', symbol: 'USDJPY', price: '150.250', change: '+0.00%', up: true },
  { pair: 'XAU/USD', symbol: 'XAUUSD', price: '3705.00', change: '+0.00%', up: true },
  { pair: 'BTC/USD', symbol: 'BTCUSD', price: '98450.00', change: '+0.00%', up: true }
];

// ===== AMBIL HARGA REAL-TIME DARI BIQUOTE.IO (GRATIS, TANPA KUNCI) =====
async function fetchPrices() {
  for (const item of prices) {
    try {
      const res = await fetch(`https://biquote.io/api/${item.symbol}`);
      if (res.ok) {
        const data = await res.json();
        const oldPrice = parseFloat(item.price.replace(',', ''));
        const newPrice = data.bid;
        const changePct = ((newPrice - oldPrice) / oldPrice) * 100;
        
        item.price = newPrice.toFixed(item.pair.includes('XAU') || item.pair.includes('BTC') ? 2 : 5);
        item.change = (changePct >= 0 ? '+' : '') + changePct.toFixed(2) + '%';
        item.up = changePct >= 0;
      }
    } catch (err) {
      console.log(`${item.pair}: ${err.message}`);
    }
  }
  renderPrices();
}

// ===== TAMPILKAN HARGA KE HALAMAN =====
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

// ===== JALANKAN =====
fetchPrices();                  // ambil pertama kali
setInterval(fetchPrices, 30000); // update tiap 30 detik otomatis

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
