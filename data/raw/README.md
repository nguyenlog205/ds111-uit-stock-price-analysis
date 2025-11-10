

## 2. Data Source and Storage

### 2.1. Macroeconomics Indices
> Macroeconomics indices are stored in the sub-folder `/macro/`.

|Name| Source| Storage File (raw version)|
|-|-|-|
|USD-VND Exchange Rate| Investing, https://vn.investing.com/currencies/usd-vnd-historical-data| `USD_VND.csv`|
|Viet Nam CPI|Investing, https://vn.investing.com/economic-calendar/vietnamese-cpi-1851| `vietnam_cpi.csv`|
|Viet Nam GDP|World Bank, https://data.worldbank.org/indicator/NY.GDP.MKTP.CD?locations=VN| `vietnam_gdp.csv`|
|XAU-VND Exchange Rate|


### 2.2. Industry Indices
|Name| Source| Storage File (raw version)|
|-|-|-|
|Price per Earning for ICT industry| Simply Wall, https://simplywall.st/markets/vn/tech| `price_per_earning.csv`|


### 2.3. FPT Indices
|Name| Source| Storage File (raw version)|
|-|-|-|
|Net Revenue <br> Gross Profit <br> Earnings Before Interest and Taxes <br> Net Profit Attributable to Parent Shareholders | Via `vnstock` Pythonic library (API) |`fpt_income_statement.csv`| 