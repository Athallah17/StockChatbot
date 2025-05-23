import pickle
import pandas as pd
import numpy as np
from pathlib import Path

class PredictionAgent:
    def __init__(self):
        self.model_dir = Path(__file__).resolve().parent.parent / "models" / "predict"

        self.valid_horizons = [1, 3, 5, 7, 14, 30, 60, 90]
        self.feature_order = [
            "Close", "sma_10", "sma_20", "rsi", "macd", "obv",
            "ema_10", "ema_20", "roc", "adx", "return", "lag_1", "lag_2", "n_days"
        ]

    def _round_horizon(self, n_days: int) -> int:
        return min(self.valid_horizons, key=lambda x: abs(x - n_days))

    def load_model(self, n_days: int):
        model_file = self.model_dir / f"predict_model_{n_days}.pkl"
        if not model_file.exists():
            raise FileNotFoundError(f"Model for {n_days} days not found: {model_file}")
        with open(model_file, "rb") as f:
            return pickle.load(f)

    def predict(self, features: dict, requested_horizon: int) -> dict:
        # Gunakan model yang paling dekat dengan n_days yang diminta
        n_days = self._round_horizon(requested_horizon)

        # Update fitur untuk menyertakan nilai n_days yang digunakan
        features = features.copy()
        features["n_days"] = n_days

        # Susun dalam urutan yang tepat
        df = pd.DataFrame([features])[self.feature_order]

        # Load dan prediksi
        model = self.load_model(n_days)
        prediction = model.predict(df)[0]

        return {
            "used_horizon": n_days,
            "predicted_price": round(float(prediction), 2)
        }
