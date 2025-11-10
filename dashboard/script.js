// script.js (Logic Định lượng Chi tiết)

// --- Dữ liệu Mẫu Giả lập (Mock Data) cho 25 ngày ---
const MOCK_DATA_LENGTH = 25;
const basePrice = 90000;
const startDate = new Date(2025, 9, 1); // 1/10/2025

// Tạo dữ liệu giả lập chi tiết
const fptData = Array.from({ length: MOCK_DATA_LENGTH }, (_, i) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i * 1.4); // Mô phỏng ngày giao dịch
    const price = basePrice + Math.sin(i / 5) * 5000 + Math.random() * 2000 - 1000;
    const volume = 1000000 + Math.random() * 1500000;
    
    // Giả lập MACD và Stochastic cho mục đích biểu đồ
    const macd = Math.sin(i / 4) * 1000 + 500;
    const signal = Math.sin((i - 1) / 4) * 1000 + 600;
    const rsi = 30 + Math.abs(Math.sin(i / 3)) * 40;
    const k = 10 + Math.abs(Math.cos(i / 5)) * 80;
    const d = 15 + Math.abs(Math.cos((i - 1) / 5)) * 80;

    return {
        date: date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
        price: Math.round(price / 100) * 100, // Làm tròn đến trăm
        volume: Math.round(volume / 1000) * 1000,
        macd: Math.round(macd),
        signal: Math.round(signal),
        rsi: parseFloat(rsi.toFixed(2)),
        stochK: parseFloat(k.toFixed(2)),
        stochD: parseFloat(d.toFixed(2))
    };
});

// --- Hàm Mô phỏng Tính toán Định lượng Nâng cao ---

function calculateMetrics(data) {
    const latest = data[data.length - 1];
    const previous = data[data.length - 2] || data[data.length - 1];
    
    // 1. Tính toán Hiệu suất & Rủi ro
    const prices = data.map(d => d.price);
    const returns = prices.slice(1).map((p, i) => (p - prices[i]) / prices[i]);
    
    // Tính Volatility (Độ lệch chuẩn của lợi nhuận hàng ngày, quy đổi ra năm)
    const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
    const variance = returns.map(r => Math.pow(r - avgReturn, 2)).reduce((a, b) => a + b, 0) / returns.length;
    const dailyStdDev = Math.sqrt(variance);
    const annualizedVol = dailyStdDev * Math.sqrt(252); // Giả định 252 ngày giao dịch/năm

    // Giả lập Beta (Thường dựa trên hồi quy với VN-Index)
    const beta = 0.85; // FPT thường có Beta thấp hơn 1

    // Khối lượng TB 10 ngày
    const avgVolume10 = data.slice(-10).reduce((acc, curr) => acc + curr.volume, 0) / 10;

    return {
        latestPrice: latest.price,
        dailyChange: (latest.price - previous.price) / previous.price,
        avgVolume: avgVolume10,
        beta: beta,
        volatility: annualizedVol,
        latestRSI: latest.rsi,
        latestStochK: latest.stochK,
        latestStochD: latest.stochD,
    };
}

// --- Hàm Cập nhật các Thẻ Số liệu và Tín hiệu ---

function updateDashboard() {
    const metrics = calculateMetrics(fptData);

    // 1. Cập nhật Thẻ Số liệu Chính
    document.getElementById('close-price').textContent = metrics.latestPrice.toLocaleString('vi-VN') + ' VNĐ';
    
    const dailyChangePct = metrics.dailyChange * 100;
    const changeElement = document.getElementById('daily-change-percent');
    changeElement.textContent = `${dailyChangePct >= 0 ? '+' : ''}${dailyChangePct.toFixed(2)}%`;
    changeElement.className = `trend ${dailyChangePct >= 0 ? 'up' : 'down'}`;
    changeElement.innerHTML = `<i class="fa-solid fa-caret-${dailyChangePct >= 0 ? 'up' : 'down'}"></i> ${dailyChangePct.toFixed(2)}%`;

    document.getElementById('avg-volume').textContent = (metrics.avgVolume / 1000000).toFixed(2) + ' Triệu';
    
    document.getElementById('beta-value').textContent = metrics.beta.toFixed(2);
    document.getElementById('beta-risk-level').textContent = metrics.beta < 1 ? 'Thấp hơn Thị trường' : 'Cao hơn Thị trường';

    document.getElementById('volatility-value').textContent = (metrics.volatility * 100).toFixed(2) + '%';

    // 2. Cập nhật Chỉ số Cơ bản (Giả lập)
    document.getElementById('pe-ratio').textContent = '28.5x';
    document.getElementById('pb-ratio').textContent = '5.2x';
    document.getElementById('gross-margin').textContent = '45.0%';
    document.getElementById('revenue-growth').textContent = '+18.0%';
    document.getElementById('debt-equity').textContent = '0.4x';

    // 3. Cập nhật Tổng hợp Tín hiệu Mua/Bán
    const signals = analyzeSignals(metrics);
    updateSignalPanel(signals);
}


// --- Logic Phân tích Tín hiệu Kỹ thuật ---

function getSignalState(value, buyThreshold, sellThreshold, neutralColor) {
    if (value >= sellThreshold) return { text: 'BÁN', color: 'var(--down-color)' };
    if (value <= buyThreshold) return { text: 'MUA', color: 'var(--up-color)' };
    return { text: 'TRUNG LẬP', color: neutralColor };
}

function analyzeSignals(metrics) {
    let buyScore = 0;
    let sellScore = 0;

    // RSI Signal
    const rsiState = getSignalState(metrics.latestRSI, 30, 70, 'var(--neutral-color)');
    if (rsiState.text === 'MUA') buyScore += 1;
    if (rsiState.text === 'BÁN') sellScore += 1;

    // Stochastic Signal (K < D = SELL, K > D = BUY)
    let stochText = 'TRUNG LẬP';
    let stochColor = 'var(--neutral-color)';

    if (metrics.latestStochK > metrics.latestStochD && metrics.latestStochK < 80) {
        stochText = 'MUA';
        stochColor = 'var(--up-color)';
        buyScore += 1;
    } else if (metrics.latestStochK < metrics.latestStochD && metrics.latestStochK > 20) {
        stochText = 'BÁN';
        stochColor = 'var(--down-color)';
        sellScore += 1;
    }

    // MACD Signal (Giả lập: MACD line > Signal line = BUY)
    const latestMACD = fptData[fptData.length - 1];
    let macdText = 'TRUNG LẬP';
    let macdColor = 'var(--neutral-color)';

    if (latestMACD.macd > latestMACD.signal) {
        macdText = 'MUA';
        macdColor = 'var(--up-color)';
        buyScore += 1;
    } else if (latestMACD.macd < latestMACD.signal) {
        macdText = 'BÁN';
        macdColor = 'var(--down-color)';
        sellScore += 1;
    }

    // MA Signal (Giả lập: Giá > MA20 = BUY)
    let maText = 'Mạnh MUA';
    let maColor = 'darkgreen';
    buyScore += 2; // MA là chỉ báo mạnh

    // ADX Signal (Giả lập)
    const adxValue = 35; // ADX > 25 là xu hướng mạnh
    let adxText = 'Xu hướng Mạnh';
    
    // Final Decision
    let finalDecision = 'TRUNG LẬP';
    let finalClass = 'neutral';
    
    if (buyScore > sellScore + 1) {
        finalDecision = 'MẠNH MUA';
        finalClass = 'strong-buy';
    } else if (buyScore > sellScore) {
        finalDecision = 'MUA';
        finalClass = 'buy';
    } else if (sellScore > buyScore + 1) {
        finalDecision = 'MẠNH BÁN';
        finalClass = 'strong-sell';
    } else if (sellScore > buyScore) {
        finalDecision = 'BÁN';
        finalClass = 'sell';
    }

    return {
        rsi: { text: rsiState.text, color: rsiState.color },
        stoch: { text: stochText, color: stochColor },
        macd: { text: macdText, color: macdColor },
        ma: { text: maText, color: maColor },
        adx: { text: adxText },
        final: { text: finalDecision, class: finalClass }
    };
}

function updateSignalPanel(signals) {
    // Cập nhật các tín hiệu thành phần
    document.getElementById('ma-signal').textContent = signals.ma.text;
    document.getElementById('ma-signal').style.backgroundColor = signals.ma.color;
    
    document.getElementById('stochastic-signal').textContent = signals.stoch.text;
    document.getElementById('stochastic-signal').style.backgroundColor = signals.stoch.color;
    
    document.getElementById('macd-signal').textContent = signals.macd.text;
    document.getElementById('macd-signal').style.backgroundColor = signals.macd.color;
    
    document.getElementById('adx-signal-text').textContent = signals.adx.text;
    // ADX không có tín hiệu MUA/BÁN mà chỉ là sức mạnh, nên không cần đổi màu nền.

    // Cập nhật Quyết định Cuối cùng
    const finalElement = document.getElementById('final-decision');
    finalElement.textContent = signals.final.text;
    finalElement.className = `signal-final ${signals.final.class}`;
}


// --- Logic Vẽ Biểu đồ Chart.js ---

function renderCharts(data) {
    // 1. Biểu đồ Stochastic Oscillator
    const ctxStoch = document.getElementById('stochasticChart').getContext('2d');
    new Chart(ctxStoch, {
        type: 'line',
        data: {
            labels: data.map(d => d.date),
            datasets: [
                {
                    label: '%K Line',
                    data: data.map(d => d.stochK),
                    borderColor: '#2980b9',
                    tension: 0.2,
                    pointRadius: 1,
                    fill: false
                },
                {
                    label: '%D Line',
                    data: data.map(d => d.stochD),
                    borderColor: '#f1c40f',
                    tension: 0.2,
                    pointRadius: 1,
                    fill: false
                }
            ]
        },
        options: {
            maintainAspectRatio: false,
            scales: {
                y: { min: 0, max: 100, ticks: { stepSize: 20 } },
            },
            plugins: {
                annotation: {
                    annotations: {
                        line70: { type: 'line', yMin: 80, yMax: 80, borderColor: 'red', borderWidth: 1, borderDash: [5, 5] },
                        line30: { type: 'line', yMin: 20, yMax: 20, borderColor: 'green', borderWidth: 1, borderDash: [5, 5] }
                    }
                }
            }
        }
    });

    // 2. Biểu đồ RSI
    const ctxRSI = document.getElementById('rsiChart').getContext('2d');
    new Chart(ctxRSI, {
        type: 'line',
        data: {
            labels: data.map(d => d.date),
            datasets: [
                {
                    label: 'RSI (14)',
                    data: data.map(d => d.rsi),
                    borderColor: '#1abc9c',
                    tension: 0.2,
                    pointRadius: 1,
                    fill: false
                }
            ]
        },
        options: {
            maintainAspectRatio: false,
            scales: {
                y: { min: 0, max: 100, ticks: { stepSize: 20 } },
            },
            plugins: {
                annotation: {
                    annotations: {
                        line70: { type: 'line', yMin: 70, yMax: 70, borderColor: 'red', borderWidth: 1, borderDash: [5, 5] },
                        line30: { type: 'line', yMin: 30, yMax: 30, borderColor: 'green', borderWidth: 1, borderDash: [5, 5] }
                    }
                }
            }
        }
    });
}


// --- Khởi tạo Dashboard ---
document.addEventListener('DOMContentLoaded', () => {
    updateDashboard();
    renderCharts(fptData);
});