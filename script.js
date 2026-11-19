// Data harga simulasi — nanti bisa diganti API asli
const prices = [
  { pair: 'EUR/USD', price: '1.08642', change: '+0.24%', up: true },
  { pair: 'GBP/USD', price: '1.27185', change: '+0.18%', up: true },
  { pair: 'USD/JPY', price: '149.825', change: '-0.12%', up: false },
  { pair: 'XAU/USD', price: '2039.65', change: '+0.32%', up: true },
  { pair: 'BTC/USD', price: '68,420.50', change: '-1.45%', up: false }
];

// Update harga di halaman
function updatePrices() {
  const priceItems = document.querySelectorAll('.price-item');
  
  prices.forEach((item, index) => {
    if (priceItems[index]) {
      // Tambah sedikit perubahan acak agar terlihat hidup
      const fluctuation = (Math.random() - 0.5) * 0.001;
      let newPrice = parseFloat(item.price.replace(',', '')) + fluctuation;
      if (item.pair.includes('/') && !item.pair.includes('BTC') && !item.pair.includes('XAU')) {
        newPrice = newPrice.toFixed(5);
      } else if (item.pair.includes('XAU')) {
        newPrice = newPrice.toFixed(2);
      } else if (item.pair.includes('BTC')) {
        newPrice = newPrice.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      } else {
        newPrice = newPrice.toFixed(3);
      }
      
      const priceEl = priceItems[index].querySelector('.pair-price');
      if (priceEl) {
        priceEl.style.opacity = '0.5';
        setTimeout(() => {
          priceEl.textContent = newPrice;
          priceEl.style.opacity = '1';
        }, 150);
      }
    }
  });
}

// Jalankan pembaruan harga setiap 3 detik
setInterval(updatePrices, 3000);

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
