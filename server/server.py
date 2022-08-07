from flask import Flask, request
from ml_engine import predict

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
    except:
        resp = {"Error": "Unable to parse provided arguments"}

    return resp 

    

