from PIL import Image
import numpy as np
from io import BytesIO
import requests
import tensorflow as tf
from flask import Flask, request, jsonify

app = Flask(__name__)

# Load model once when server starts
model = tf.keras.models.load_model('./eff_model.keras')

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()

    if not data or 'picture' not in data:
        return jsonify({"error": "No image URL provided"}), 400

    
    try:
        image_url = data['picture']
        response = requests.get(image_url)
        img = Image.open(BytesIO(response.content)).convert('RGB')
        img = img.resize((300, 300))

        img_array = np.array(img) / 255.0
        img_array = np.expand_dims(img_array, axis=0)

        prediction = model.predict(img_array)[0][0]

        # Class names
        class_names = ["scol", "normal"]
        predicted_class = class_names[int(round(prediction))]

        # Danger score (integer from 0–10)
        confidence = prediction if predicted_class == "normal" else 1 - prediction
        if predicted_class == "normal":
            danger_score = int(round((1 - confidence) * 10))
        else:
            danger_score = int(round(confidence * 10))

        return jsonify({
            'diseaseName': predicted_class,
            'dangerScore': danger_score,
            'message': 'Prediction successful'
        })

    except Exception as e:
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    app.run(debug=True)
