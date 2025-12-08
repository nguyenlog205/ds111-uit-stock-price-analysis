import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler

def log_differencing(
    series: pd.Series,
    periods: int = 1
) -> pd.Series:
    """
    Tính toán sai phân logarit (Log Differencing), hay lợi nhuận logarit.

    Công thức: Delta_ln(Y_t) = ln(Y_t) - ln(Y_{t-k})

    Args:
        series (pd.Series): Chuỗi dữ liệu chuỗi thời gian đầu vào (ví dụ: tỷ giá, giá vàng).
        periods (int): Khoảng thời gian để lấy sai phân (mặc định là 1).

    Returns:
        pd.Series: Chuỗi dữ liệu đã lấy sai phân log.
    """
    log_series = np.log(series)
    diff_log_series = log_series.diff(periods=periods)
    diff_log_series.name = f"log_return_{series.name}"
    
    return diff_log_series

def preprocessing(dataset: pd.DataFrame) -> pd.DataFrame:
    """
    Hàm tiền xử lý dữ liệu tổng hợp từ các bước EDA.
    1. Điền giá trị thiếu (Missing Value Imputation).
    2. Tạo biến Log Return cho các chuỗi thời gian biến động.
    3. Chuẩn hóa (Scaling) dữ liệu.
    
    Input: dataset gốc
    Output: dataset đã preprocessed (giữ nguyên cột cũ + thêm cột mới đã scale)
    """
    df = dataset.copy()
    
    # ---------------------------------------------------------
    # NHÓM 1: CÁC BIẾN CẦN TÍNH LOG RETURN + SCALE
    # ---------------------------------------------------------
    log_return_cols = [
        'cpi_rate', 
        'usd_vnd_rate', 
        'xau_usd_rate', 
        'pe_ratio', 
        'fpt_stock_price', 
        'fpt_stock_volume'
    ]
    
    existing_log_cols = [col for col in log_return_cols if col in df.columns]
    
    scaler = StandardScaler()
    
    for col in existing_log_cols:
        # --- Lấy sai phân ---
        df[col] = df[col].ffill().bfill()
        new_col_name = f"{col}_log_return" 
        df[new_col_name] = log_differencing(df[col], periods=1)
        df[new_col_name] = df[new_col_name].bfill().ffill()
        
        # --- Scale biến mới tạo ---
        scaled_data = scaler.fit_transform(df[new_col_name].values.reshape(-1, 1))
        df[new_col_name] = pd.Series(scaled_data.flatten(), index=df.index)

    # ---------------------------------------------------------
    # NHÓM 2: CÁC BIẾN CHỈ CẦN SCALE (KHÔNG TÍNH LOG RETURN)
    # ---------------------------------------------------------
    scale_only_cols = [
        'gdp_value', 
        'market_cap', 
        'fpt_net_revenue', 
        'fpt_gross_profit', 
        'fpt_operating_profit', 
        'fpt_net_profit'
    ]
    
    existing_scale_cols = [col for col in scale_only_cols if col in df.columns]
    
    for col in existing_scale_cols:
        # --- Điền khuyết ---
        df[col] = df[col].ffill().bfill()
        
        # --- Scale ---
        new_col_name = f"{col}_scaled"
        scaled_data = scaler.fit_transform(df[col].values.reshape(-1, 1))
        df[new_col_name] = pd.Series(scaled_data.flatten(), index=df.index)

    return df