import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from arch import arch_model

class GARCHModel:
    """
    Một lớp tổng quát để dễ dàng fit, phân tích và vẽ đồ thị
    cho mô hình GARCH(p, q) sử dụng thư viện 'arch'.
    """
    def __init__(self, returns_data, p=1, q=1):
        """
        Khởi tạo mô hình GARCH.

        Args:
            returns_data (pd.Series or np.array): Chuỗi dữ liệu tỷ suất sinh lời.
            p (int): Bậc p của thành phần ARCH.
            q (int): Bậc q của thành phần GARCH.
        """
        if not isinstance(returns_data, (pd.Series, np.ndarray)):
            raise TypeError("returns_data phải là một pandas Series hoặc numpy array.")
        
        self.returns = returns_data
        self.p = p
        self.q = q
        self.model = None
        self.results = None
        print(f"GARCHModel(p={p}, q={q}) đã được khởi tạo.")

    def fit(self, disp='off'):
        """
        Fit mô hình GARCH với dữ liệu đã cung cấp.

        Args:
            disp (str): 'on' để hiển thị thông tin tối ưu hóa, 'off' để ẩn.
        """
        # 1. Định nghĩa mô hình
        self.model = arch_model(self.returns, vol='Garch', p=self.p, q=self.q)
        
        # 2. Fit mô hình
        self.results = self.model.fit(disp=disp)
        print("Mô hình đã được fit thành công!")
        return self # Trả về chính đối tượng để có thể chaining method

    def summary(self):
        """
        In ra bảng tóm tắt kết quả của mô hình GARCH.
        """
        if self.results is None:
            print("Lỗi: Mô hình chưa được fit. Vui lòng gọi phương thức .fit() trước.")
            return
        
        print(self.results.summary())

    def plot_volatility(self, stock_name=""):
        """
        Vẽ đồ thị phương sai có điều kiện (conditional volatility) của mô hình.

        Args:
            stock_name (str): Tên của cổ phiếu hoặc chuỗi dữ liệu để hiển thị trên tiêu đề.
        """
        if self.results is None:
            print("Lỗi: Mô hình chưa được fit. Vui lòng gọi phương thức .fit() trước.")
            return

        # Lấy dữ liệu phương sai có điều kiện
        conditional_volatility = self.results.conditional_volatility

        # Vẽ đồ thị
        plt.style.use('seaborn-v0_8-whitegrid')
        plt.figure(figsize=(15, 6))
        plt.plot(self.returns.index, conditional_volatility, color='dodgerblue', linewidth=1.5)
        
        title_str = f'Conditional Volatility (GARCH({self.p}, {self.q}))'
        if stock_name:
            title_str = f'{title_str} for {stock_name}'
            
        plt.title(title_str, fontsize=16)
        plt.xlabel('Date', fontsize=12)
        plt.ylabel('Volatility', fontsize=12)
        plt.show()