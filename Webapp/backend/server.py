
# from flask import Flask, request, jsonify
# import xgboost as xgb
# import numpy as np
# from flask_cors import CORS

# app = Flask(__name__)
# CORS(app)  


# model = xgb.XGBRegressor()
# model.load_model("model/xgboost3_model.json") 

# @app.route('/predict', methods=['POST'])
# def predict():
#     try:
#         data = request.get_json()

        
#         open_price = float(data['Open'])
#         high_price = float(data['High'])
#         low_price = float(data['Low'])
#         close_price = float(data['Close'])
#         volume = float(data['Volume'])


#         input_data = np.array([[open_price, high_price, low_price, close_price, volume]])

       
#         prediction = model.predict(input_data)

#         return jsonify(predictedPrice=float(prediction[0]))

#     except Exception as e:
#         return jsonify(error=str(e)), 400

# @app.route('/historicall/<symbol>', methods=['GET'])
# def get_historical_data(symbol):
 
#     pass 

# if __name__ == '__main__':
#     app.run(debug=True, port=5003) 
from flask import Flask, request, jsonify
import xgboost as xgb
import numpy as np
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/predict/<symbol>', methods=['POST'])
def predict(symbol):
    try:
        data = request.get_json()

        # Convert incoming values to floats
        open_price = float(data['Open'])
        high_price = float(data['High'])
        low_price = float(data['Low'])
        close_price = float(data['Close'])
        volume = float(data['Volume'])

        # Prepare input for prediction
        input_data = np.array([[open_price, high_price, low_price, close_price, volume]])

        # Ensure model file exists
        model_path = f"models/{symbol.upper()}.json"
        if not os.path.exists(model_path):
            return jsonify(error=f"Model for symbol '{symbol.upper()}' not found at path: {model_path}"), 404

        # Load the correct XGBoost model
        model = xgb.XGBRegressor()
        model.load_model(model_path)

        # Make prediction
        prediction = model.predict(input_data)

        return jsonify(predictedPrice=float(prediction[0]))

    except Exception as e:
        return jsonify(error=str(e)), 400


@app.route('/historicall/<symbol>', methods=['GET'])
def get_historical_data(symbol):
    # You can implement this later
    return jsonify(message="Historical data endpoint not implemented yet.")


if __name__ == '__main__':
    app.run(debug=True, port=5003)
