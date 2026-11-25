// ==========================================
// ISI API KEY KAMU DI BAWAH INI
// ==========================================
const API_KEY = "";

let prices = [];

// ===== AMBIL HARGA DARI API EXNESS =====
async function ambilHarga() {
  try {
    // Sesuaikan endpoint sesuai dokumentasi API Exness kamu
    const res = await fetch(
      `https://api.exness.com/v1/market/tickers?symbols=XAUUSD,EURUSD,GBPUSD,USDJPY,BTCUSD`,
      {
        headers: {
          "Authorization": `Token ${API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );
    
    const data = await res.json();
    ubahKeVariabel(data);
    
  } catch (err) {
    console.log("Pakai data simulasi:", err);
    pakaiDataSimulasi();
  }
}

// ===== DATA SIMULASI JIKA API BELUM JALAN =====
function pakaiDataSimulasi() {
  prices = [
    { pair: 'EUR/USD', price: '1.08450', change: '+0.05%', up: true },
    { pair: 'GBP/USD', price: '1.26980', change: '-0.02%', up: false },
    { pair: 'USD/JPY', price: '150.250', change: '+0.08%', up: true },
    { pair: 'XAU/USD', price: '3705.00', change: '-0.15%', up: false },
    { pair: 'BTC/USD', price: '98450.00', change: '+0.25%', up: true }
  ];
  renderPrices();
}

// ===== UBAH FORMAT API KE TAMPILAN =====
function ubahKeVariabel(data) {
  // ⚠️ Sesuaikan struktur ini dengan balikan API asli Exness kamu
  prices = [
    { pair: 'EUR/USD', price: data?.EURUSD?.last || '1.08450', change: data?.EURUSD?.change || '+0.00%', up: true },
    { pair: 'GBP/USD', price: data?.GBPUSD?.last || '1.26980', change: data?.GBPUSD?.change || '+0.00%', up: true },
    { pair: 'USD/JPY', price: data?.USDJPY?.last || '150.250', change: data?.USDJPY?.change || '+0.00%', up: true },
    { pair: 'XAU/USD', price: data?.XAUUSD?.last || '3705.00', change: data?.XAUUSD?.change || '+0.00%', up: true },
    { pair: 'BTC/USD', price: data?.BTCUSD?.last || '98450.00', change: data?.BTCUSD?.change || '+0.00%', up: true }
  ];
  renderPrices();
}

// ===== TAMPILKAN HARGA =====
function renderPrices() {
    const priceGrid = document.getElementById('priceGrid');
    const chartPrice = document.getElementById('chartPrice');
    const chartChange = document.getElementById('chartChange');
    
    if (priceGrid && prices.length > 0) {
        priceGrid.innerHTML = '';
        prices.slice(1).forEach(item => {
            priceGrid.innerHTML += `
                <div class="mini-price">
                    <div class="mini-pair">${item.pair}</div>
                    <div class="mini-value">${item.price} 
                        <span style="font-size:0.75rem;color:${item.up?'#00C853':'#FF4757'}">
                            ${item.up?'↑':'↓'}
                        </span>
                    </div>
                </div>
            `;
        });
    }
    
    const xau = prices.find(p => p.pair === 'XAU/USD');
    if (xau && chartPrice) {
        chartPrice.textContent = xau.price;
        if (chartChange) {
            chartChange.textContent = `${xau.change} ${xau.up ? '↑' : '↓'}`;
            chartChange.className = `chart-change ${xau.up ? 'up' : 'down'}`;
        }
    }
}

// ===== MENU MOBILE =====
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
}

// ===== MULAI =====
ambilHarga();
setInterval(ambilHarga, 5000);
