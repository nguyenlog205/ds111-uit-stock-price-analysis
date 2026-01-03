# DS111 - Phân Tích và Dự Đoán Giá Cổ Phiếu FPT

## Giới thiệu
> Dự án này là một phần của môn học **DS111 - Phân tích dữ liệu** tại trường Đại học Công nghệ Thông tin, ĐHQG-HCM. Mục tiêu chính là áp dụng các kỹ thuật Khoa học Dữ liệu để phân tích, trực quan hóa và dự đoán biến động giá cổ phiếu của tập đoàn FPT dựa trên dữ liệu lịch sử và các chỉ số kinh tế vĩ mô.Dự án bao gồm quy trình trọn vẹn từ thu thập dữ liệu (Data Ingestion), làm sạch (Preprocessing), phân tích khám phá (EDA), xây dựng mô hình (Modeling) đến hiển thị kết quả trên Dashboard.
## Cấu trúc dự án
```t
ds111-uit-stock-price-analysis/
├── dashboard/               # Giao diện web hiển thị kết quả
│   ├── index.html
│   ├── script.js
│   └── style.css
├── data/                    # Dữ liệu của dự án
│   ├── raw/                 # Dữ liệu thô (FPT, Vĩ mô, Ngành)
│   ├── synthetized_dataset.csv # Dữ liệu đã được tổng hợp và làm sạch
│   └── predictive_modeling.csv # Dữ liệu dùng cho mô hình dự đoán
├── notebook/                # Các Jupyter Notebook phân tích
│   ├── data_ingestion/      # Thu thập dữ liệu (API)
│   ├── modeling/            # Các mô hình (XGBoost, GARCH...)
│   ├── dataset_synthesis.ipynb
│   └── eda-synthetized-dataset.ipynb
├── src/                     # Mã nguồn xử lý chính
│   ├── datasets/            # Script thu thập tin tức
│   ├── modeling/            # Source code mô hình (GARCH)
│   └── preprocessor.py      # Các hàm tiền xử lý dữ liệu
└── requirements.txt         # Các thư viện cần thiết
```
## Dữ liệu sử dụng
Dự án sử dụng kết hợp nhiều nguồn dữ liệu để tăng độ chính xác:
1. Dữ liệu nội tại doanh nghiệp (FPT): Lịch sử giá cổ phiếu (OHLCV); Báo cáo tài chính (Income Statement).
2. Dữ liệu vĩ mô (Macro-economics):Tỷ giá USD/VND.Giá vàng (XAU/USD); Chỉ số giá tiêu dùng (CPI) Việt Nam; Tổng sản phẩm quốc nội (GDP) Việt Nam.
3. Dữ liệu ngành: Chỉ số P/E trung bình ngành.

##  Cài đặt và Sử dụng
### Yêu cầu hệ thống
1. `Python 3.8` trở lên, khuyến nghị `3.10.x`.
2. Các thư viện trong requirements.txt.

### Cài đặt môi trường
- Cài đặt môi trườngClone repository và cài đặt các thư viện cần thiết:
```bash
git clone [https://github.com/nguyenlog205/ds111-uit-stock-price-analysis.git](https://github.com/nguyenlog205/ds111-uit-stock-price-analysis.git)
cd ds111-uit-stock-price-analysis
pip install -r requirements.txt
```
### Quy trình chạy dự án
- Bước 1: Chạy notebook notebook/dataset_synthesis.ipynb để gộp các file raw data thành synthetized_dataset.csv.
- Bước 2: Xem notebook/eda-synthetized-dataset.ipynb để hiểu về phân phối dữ liệu và các tương quan biến số.
- Bước 3: Các mô hình được thử nghiệm nằm trong thư mục 
    - `notebook/modeling/xgboost_price.ipynb`: Dự đoán giá trị cổ phiếu.
    - `notebook/modeling/xgboost_log_return.ipynb`: Dự đoán tỷ suất sinh lợi (log return).
    - `FPT_stock_price_analysis.ipynb`: Phân tích tổng quan (thống kê mô tả, phân tích xu hướng, phân tích độ biến động với GARCH-ARIMA và mô phỏng Monte Carlo). 

## Các phương pháp & Mô hình
- XGBoost: Sử dụng để dự đoán giá đóng cửa và log return dựa trên các features đã engineer.
- GARCH: Sử dụng để mô hình hóa phương sai sai số ##(volatility clustering) của chuỗi thời gian tài chính.
- NLP (Natural Language Processing): (Trong src/datasets/ingest_news.py) Thu thập và xử lý tin tức tài chính để hỗ trợ dự đoán (Sentiment Analysis).


> Đóng góp bởi Nguyễn Hoàng Long, Hồ Tấn Dũng (lớp KHDL2023, UIT@VNUHCM)