import pickle
import pandas as pd
from pathlib import Path

class PredictionAgent:
    def __init__(self):
        # Load model secara aman relatif terhadap file ini
        model_path = Path(__file__).resolve().parent.parent / "models" / "predict_model_2.pkl"
        with open(model_path, "rb") as f:
            self.model = pickle.load(f)

        self.feature_order = [
            "Close", "sma_10", "sma_20", "rsi", "macd", "obv",
            "ema_10", "ema_20", "roc", "adx", "return", "n_days"
        ]

    def predict(self, features: dict) -> float:
        # Pastikan urutan kolom sama dengan saat training
        df = pd.DataFrame([features])[self.feature_order]
        prediction = self.model.predict(df)[0]
        return round(prediction, 2)
