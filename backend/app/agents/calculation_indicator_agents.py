import yfinance as yf
import pandas as pd
from typing import List, Dict, Any
from ta.trend import SMAIndicator, EMAIndicator, MACD, ADXIndicator
from ta.momentum import RSIIndicator, ROCIndicator
from ta.volume import OnBalanceVolumeIndicator


class IndicatorAgent:
    def __init__(self):
        self.indicators = {
            "SMA": self.calculate_sma,
            "EMA": self.calculate_ema,
            "MACD": self.calculate_macd,
            "ADX": self.calculate_adx,
            "RSI": self.calculate_rsi,
            "ROC": self.calculate_roc,
            "OBV": self.calculate_obv
        }

    def get_market_data(self, ticker: str, period: str = "3mo", interval: str = "1d") -> pd.DataFrame:
        stock = yf.Ticker(ticker)
        hist = stock.history(period=period, interval=interval)
        return hist.reset_index()

    def calculate_sma(self, data: pd.DataFrame, window: int) -> pd.Series:
        sma = SMAIndicator(data['Close'], window=window)
        return sma.sma_indicator()

    def calculate_ema(self, data: pd.DataFrame, window: int) -> pd.Series:
        ema = EMAIndicator(data['Close'], window=window)
        return ema.ema_indicator()

    def calculate_macd(self, data: pd.DataFrame) -> Dict[str, pd.Series]:
        macd = MACD(data['Close'])
        return {
            'macd': macd.macd(),
            'signal': macd.macd_signal(),
            'hist': macd.macd_diff()
        }

    def calculate_adx(self, data: pd.DataFrame, window: int) -> pd.Series:
        adx = ADXIndicator(data['High'], data['Low'], data['Close'], window=window)
        return adx.adx()

    def calculate_rsi(self, data: pd.DataFrame, window: int) -> pd.Series:
        rsi = RSIIndicator(data['Close'], window=window)
        return rsi.rsi()

    def calculate_roc(self, data: pd.DataFrame, window: int) -> pd.Series:
        roc = ROCIndicator(data['Close'], window=window)
        return roc.roc()

    def calculate_obv(self, data: pd.DataFrame) -> pd.Series:
        obv = OnBalanceVolumeIndicator(data['Close'], data['Volume'])
        return obv.on_balance_volume()

    def calculate_all(self, data: pd.DataFrame) -> pd.DataFrame:
        data = data.copy()
        data['sma_10'] = self.calculate_sma(data, 10)
        data['sma_20'] = self.calculate_sma(data, 20)
        data['ema_10'] = self.calculate_ema(data, 10)
        data['ema_20'] = self.calculate_ema(data, 20)
        macd = self.calculate_macd(data)
        data['macd'] = macd['macd']
        data['macd_signal'] = macd['signal']
        data['macd_hist'] = macd['hist']
        data['adx'] = self.calculate_adx(data, 14)
        data['rsi'] = self.calculate_rsi(data, 14)
        data['roc'] = self.calculate_roc(data, 5)
        data['obv'] = self.calculate_obv(data)
        data['return'] = data['Close'].pct_change()
        data['lag_1'] = data['Close'].shift(1)
        data['lag_2'] = data['Close'].shift(2)
        return data

    def get_latest(self, df: pd.DataFrame) -> Dict[str, Any]:
        latest = df.dropna().iloc[-1]
        return latest.to_dict()
    
    def compute(self, name: str, data: pd.DataFrame, **kwargs) -> Any:
        if name not in self.indicators:
            raise ValueError(f"Indicator '{name}' is not supported.")
        return self.indicators[name](data, **kwargs)