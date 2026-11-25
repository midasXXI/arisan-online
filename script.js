// ===== GANTI API KEY KAMU DI BAWAH INI =====
const API_KEY_EXNESS = "";

// ===== AMBIL HARGA LANGSUNG DARI EXNESS =====
async function ambilHargaExness() {
  try {
    // Sesuaikan alamat endpoint sesuai dokumentasi API Exness kamu
    const res = await fetch(`https://api.exness.com/v1/market/tickers`, {
      headers: {
        "Authorization": `Token ${API_KEY_EXNESS}`
      }
    });

    const data = await res.json();
    
    // ===== SESUAIKAN FORMAT DATA =====
    // Ubah bagian di dalam kurung sesuai struktur balikan API Exness
    prices = [
      { pair: 'EUR/USD', price: data?.EURUSD?.price || '1.08450', change: data?.EURUSD?.change || '+0.00%', up: true },
      { pair: 'GBP/USD', price: data?.GBPUSD?.price || '1.26980', change: data?.GBPUSD?.change || '+0.00%', up: true },
      { pair: 'USD/JPY', price: data?.USDJPY?.price || '150.250', change: data?.USDJPY?.change || '+0.00%', up: true },
      { pair: 'XAU/USD', price: data?.XAUUSD?.price || '3705.00', change: data?.XAUUSD?.change || '+0.00%', up: true },
      { pair: 'BTC/USD', price: data?.BTCUSD?.price || '98450.00', change: data?.BTCUSD?.change || '+0.00%', up: true }
    ];

    renderAll();
  } catch (err) {
    console.log('Gagal ambil harga, pakai data sebelumnya');
  }
}

// Update setiap 10 detik
setInterval(ambilHargaExness, 10000);
ambilHargaExness();
