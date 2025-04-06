import xgboost as xgb
from sklearn.model_selection import train_test_split
import pandas as pd

# Sample dataframe
df = pd.read_csv("dataset/ASIANPAINT.csv")

# Features and labels
X = df[['Open', 'High', 'Low', 'Close', 'Volume']]
y = df['Close']  # or whatever you're predicting

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

# Train model
model = xgb.XGBRegressor()
model.fit(X_train, y_train)

# Save model properly for use with load_model
model.save_model("models/BAJAJ-AUTO.json")  # ✅ This is correct!
