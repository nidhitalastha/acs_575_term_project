"""
This module takes care of starting the API Server
"""
import os
from flask import Flask, jsonify
from flask_cors import CORS
from utils import APIException

app = Flask(__name__)
app.url_map.strict_slashes = False

CORS(app)

@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code

@app.route('/', methods=['GET'])
def handle_root():
    return "Hello from backend"

if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=PORT, debug=False)
