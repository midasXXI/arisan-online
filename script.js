// ===== DATA HARGA UTAMA =====
let prices = [
  { pair: 'EUR/USD', price: '1.08450', change: '+0.00%', up: true },
  { pair: 'GBP/USD', price: '1.26980', change: '+0.00%', up: true },
  { pair: 'USD/JPY', price: '150.250', change: '+0.00%', up: true },
  { pair: 'XAU/USD', price: '3705.00', change: '+0.00%', up: true },
  { pair: 'BTC/USD', price: '98450.00', change: '+0.00%', up: true }
];

// ===== FUNGSI: HARGA BERUBAH SENDIRI =====
function updatePricesEverySecond() {
  prices.forEach(item => {
    const current = parseFloat(item.price.replace(/,/g, ''));
    
    // Ukuran perubahan sesuai jenis pasangan
    let step;
    if (item.pair === 'BTC/USD') step = (Math.random() - 0.5) * 8;
    else if (item.pair === 'XAU/USD') step = (Math.random() - 0.5) * 1.5;
    else if (item.pair === 'USD/JPY') step = (Math.random() - 0.5) * 0.015;
    else step = (Math.random() - 0.5) * 0.00015;

    const newPrice = current + step;
    const isUp = step >= 0;
    
    // Format angka
    if (item.pair === 'BTC/USD') {
      item.price = newPrice.toFixed(2);
    } else if (item.pair === 'XAU/USD') {
      item.price = newPrice.toFixed(2);
    } else if (item.pair === 'USD/JPY') {
      item.price = newPrice.toFixed(3);
    } else {
      item.price = newPrice.toFixed(5);
    }
    
    item.up = isUp;
    item.change = (isUp ? '+' : '') + (step / current * 100).toFixed(4) + '%';
  });

  // Langsung tampilkan ke SEMUA tempat
  renderAll();
}

// ===== TAMPILKAN KE KEDUA TEMPAT SEKALIGUS =====
function renderAll() {
  renderPriceBox();
  renderTicker();
}

// 1️⃣ Update kotak harga di kanan
function renderPriceBox() {
  const priceItems = document.querySelectorAll('.price-item');
  prices.forEach((item, i) => {
    if (!priceItems[i]) return;
    
    const priceEl = priceItems[i].querySelector('.pair-price');
    const changeEl = priceItems[i].querySelector('.pair-change');
    
    if (priceEl) priceEl.textContent = item.price;
    if (changeEl) {
      changeEl.textContent = item.change;
      changeEl.className = `pair-change ${item.up ? 'change-up' : 'change-down'}`;
    }
  });
}

// 2️⃣ Update ticker berjalan di bawah
function renderTicker() {
  const tickerItems = document.querySelectorAll('.ticker span');
  prices.forEach((item, i) => {
    if (!tickerItems[i]) return;
    const strong = tickerItems[i].querySelector('strong');
    if (strong) {
      const arrow = item.up ? '↑' : '↓';
      strong.textContent = item.price + ' ' + arrow;
    }
  });
  
  // Bagian duplikat ticker (supaya mulus saat berjalan)
  const allSpans = document.querySelectorAll('.ticker span');
  const totalPairs = prices.length;
  for (let j = totalPairs; j < allSpans.length; j++) {
    const idx = j % totalPairs;
    const strong = allSpans[j].querySelector('strong');
    if (strong) {
      const arrow = prices[idx].up ? '↑' : '↓';
      strong.textContent = prices[idx].price + ' ' + arrow;
    }
  }
}

// ===== MULAI JALANKAN =====
updatePricesEverySecond(); // Jalankan pertama kali
setInterval(updatePricesEverySecond, 1000); // 🔁 UBAH SETIAP 1 DETIK

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
const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
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
