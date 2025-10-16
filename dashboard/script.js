// Chờ cho toàn bộ nội dung trang web được tải xong
document.addEventListener('DOMContentLoaded', function () {

    // --- PHẦN 1: CẬP NHẬT DỮ LIỆU CHO CÁC THẺ (CARD) ---
    // Giả lập việc lấy dữ liệu từ một API. Trong thực tế, bạn sẽ dùng fetch()
    const mockApiData = {
        totalRevenue: 54250,
        totalOrders: 820,
        newCustomers: 75,
        volatility: 1.85 
    };

    // Hàm cập nhật các con số trên thẻ
    function updateCards() {
        document.getElementById('total-revenue').textContent = `$${mockApiData.totalRevenue.toLocaleString()}`;
        document.getElementById('total-orders').textContent = mockApiData.totalOrders.toLocaleString();
        document.getElementById('new-customers').textContent = mockApiData.newCustomers.toLocaleString();
        document.getElementById('volatility').textContent = `${mockApiData.volatility.toFixed(2)}%`;
    }

    // --- PHẦN 2: VẼ BIỂU ĐỒ DOANH THU ---
    // Lấy thẻ canvas từ HTML
    const ctx = document.getElementById('revenueChart').getContext('2d');

    // Dữ liệu cho biểu đồ
    const chartData = {
        labels: ['Tuần 1', 'Tuần 2', 'Tuần 3', 'Tuần 4', 'Tuần 5', 'Tuần 6'],
        datasets: [{
            label: 'Doanh Thu ($)',
            data: [12000, 19000, 15000, 21000, 18000, 24000],
            backgroundColor: 'rgba(52, 152, 219, 0.2)', // Màu nền của các cột
            borderColor: 'rgba(52, 152, 219, 1)', // Màu viền của các cột
            borderWidth: 2,
            tension: 0.4, // Giúp làm mềm đường biểu đồ nếu type là 'line'
            fill: true, // Tô màu khu vực dưới đường biểu đồ
        }]
    };

    // Cấu hình cho biểu đồ (tùy chọn)
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function(value) {
                        return '$' + value / 1000 + 'k'; // Định dạng trục Y
                    }
                }
            }
        },
        plugins: {
            legend: {
                display: false // Ẩn chú thích mặc định
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        return `Doanh thu: $${context.parsed.y.toLocaleString()}`;
                    }
                }
            }
        }
    };

    // Tạo biểu đồ mới
    const revenueChart = new Chart(ctx, {
        type: 'line', // Loại biểu đồ: 'bar', 'line', 'pie', etc.
        data: chartData,
        options: chartOptions
    });

    // --- PHẦN 3: GỌI CÁC HÀM ĐỂ KHỞI TẠO DASHBOARD ---
    updateCards();
    
});