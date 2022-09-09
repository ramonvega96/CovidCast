from flask import Flask, jsonify, request
from ml_engine import predict
import manager

app = Flask(__name__)

@app.route("/api/forecast", methods=['GET'])
def lga_forecast():

    args = request.args
    resp = {}
    lga = None
    periods = None

    try:
        lga = str(args.get("lga", type=str).replace("%20", " "))
        periods = int(args.get("periods", default=5, type=int))
        try:
            resp = predict(lga, periods)
        except Exception as e:
            resp = {"Internal Error": str(e)}
    except Exception as e:
        resp = {"Error": "Unable to parse provided arguments - " + str(e)}

    return resp


@app.route("/api/infections-count", methods=['GET'])
def get_all_infections_count():
    response = jsonify(manager.get_all_infections_count())
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

@app.route("/api/ping", methods=['GET'])
def ping():
    response = jsonify({"payload":"pong"})
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


if __name__ == "__main__":
    app.run(debug=True, port=5000)

    

