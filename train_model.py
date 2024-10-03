import pandas as pd
import xgboost as xgb
from sklearn.model_selection import train_test_split, GridSearchCV, cross_val_score
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
import matplotlib.pyplot as plt

# Load the dataset
data = pd.read_csv('ADANIPORTS.csv')  # Replace with the correct file name

# Display the first few rows and the column names of the DataFrame
print(data.head())
print("Columns in the dataset:", data.columns)

# Define your target variable
target_column = 'Prev Close'  # Adjust this to the column you want to predict

# Check if the target column exists
if target_column not in data.columns:
    print(f"Error: Target column '{target_column}' not found in the data.")
else:
    # Select features (drop the target column and any non-numeric columns)
    X = data.drop(columns=[target_column, 'Date', 'Symbol', 'Series'], errors='ignore')  # Adjust based on actual columns
    y = data[target_column]

    # Check for NaN values and report
    nan_columns = X.columns[X.isnull().any()].tolist()
    if len(nan_columns) > 0:
        print(f"Warning: The following columns contain NaN values: {nan_columns}")

    # Check if the target variable contains NaN values
    if y.isnull().any():
        print("Warning: Target variable contains NaN values.")

    # Fill NaN values or drop rows with NaN
    X.fillna(0, inplace=True)
    y.fillna(0, inplace=True)

    # Split the dataset into training and testing sets
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Create and train the XGBoost model
    model = xgb.XGBRegressor()  # Use XGBClassifier() if your target variable is categorical
    model.fit(X_train, y_train)

    # Evaluate the model
    y_pred = model.predict(X_test)
    mse = mean_squared_error(y_test, y_pred)
    mae = mean_absolute_error(y_test, y_pred)
    r2 = r2_score(y_test, y_pred)

    print(f"Mean Squared Error: {mse:.2f}")
    print(f"Mean Absolute Error: {mae:.2f}")
    print(f"R² Score: {r2:.2f}")

    # Hyperparameter Tuning
    param_grid = {
        'n_estimators': [100, 200],
        'max_depth': [3, 4, 5],
        'learning_rate': [0.01, 0.1, 0.2],
        'subsample': [0.8, 1.0]
    }

    grid_search = GridSearchCV(xgb.XGBRegressor(), param_grid, scoring='neg_mean_squared_error', cv=5)
    grid_search.fit(X_train, y_train)

    print("Best parameters:", grid_search.best_params_)

    # Cross-Validation
    scores = cross_val_score(model, X, y, cv=5, scoring='neg_mean_squared_error')
    print("Cross-validation scores:", -scores)

    # Feature Importance Analysis
    importance = model.feature_importances_
    plt.barh(X.columns, importance)
    plt.xlabel('Feature Importance')
    plt.title('Feature Importance Analysis')
    plt.show()

    # Visualizing Predictions
    plt.scatter(y_test, y_pred)
    plt.xlabel('Actual Values')
    plt.ylabel('Predicted Values')
    plt.title('Actual vs Predicted Values')
    plt.plot([min(y_test), max(y_test)], [min(y_test), max(y_test)], color='red')  # Diagonal line
    plt.show()

    # Save the trained model to a file
    model.save_model('xgboost_model.json')
