# DATASET STORAGE

## 1. Overview
This repository contains various financial and economic datasets used for stock price analysis. The data is organized into three main categories:
- Raw data (original sources)
- Synthesized data (combined/merged datasets)
- Preprocessed data (cleaned and transformed)

## 2. Data Source and Storage

### 2.1.Macroeconomic Indicators
> Macroeconomics indices are stored in the sub-folder `/macro/`.

|Name|Description| Source| Storage File (raw version)|
|-|-|-|-|
|USD-VND Exchange Rate|Historical exchange rates between US Dollar and Vietnamese Dong| Investing, https://vn.investing.com/currencies/usd-vnd-historical-data| `USD_VND.csv`|
|Viet Nam CPI| Measures changes in price level of market basket of consumer goods and services| Investing, https://vn.investing.com/economic-calendar/vietnamese-cpi-1851| `vietnam_cpi.csv`|
|Viet Nam GDP|Annual Gross Domestic Product of Vietnam, including forecasted values|World Bank, https://data.worldbank.org/indicator/NY.GDP.MKTP.CD?locations=VN <br> IMF for 2025 forecast https://www.imf.org/external/datamapper/profile/VNM| `vietnam_gdp.csv`|
|XAU-VND Exchange Rate|Historical gold prices in USD (Price of each one ounce of gold in USD)| Investing, https://vn.investing.com/currencies/xau-usd-historical-data| `XAU_USD.csv`|


### 2.2. Industry Metrics
|Name|Description|Source| Storage File (raw version)|
|-|-|-|-|
|Price per Earning for ICT industry|Price-to-Earnings ratio for Vietnamese ICT industry| Simply Wall, https://simplywall.st/markets/vn/tech| `price_per_earning.csv`|


### 2.3. FPT Corporation Financial Metrics
> Data retrieved via `vnstock` Python library API

|Name| Source| Storage File (raw version)|
|-|-|-|
|Net Revenue <br> Gross Profit <br> Earnings Before Interest and Taxes <br> Net Profit Attributable to Parent Shareholders | Via `vnstock` Pythonic library (API) |`fpt_income_statement.csv`| 

## 3. Data Processing

### 3.1. Raw Data
- Located in `/raw/` directory
- Original data as retrieved from sources
- No modifications or cleaning applied

### 3.2. Synthesized Data
- Located in `/synthesized/` directory
- Combined datasets from multiple sources
- Maintains data integrity with source tracking

### 3.3. Preprocessed Data
- Located in `/preprocessed/` directory
- Cleaned and transformed data
- Ready for analysis and modeling
