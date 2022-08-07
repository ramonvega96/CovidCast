import pandas as pd
from prophet import Prophet
import mysql.connector

mydb = mysql.connector.connect(
    host='localhost',
    user='covidcastuser',
    password='newpassword',
    database='covidcast'
)

mycursor = mydb.cursor()


def predict(lga_name, periods):

    mycursor.execute("""SELECT notification_date, infections_count 
                        FROM lga_infections where lga_name='""" + lga_name + """' order by notification_date""")

    rows = mycursor.fetchall()
    mycursor.close()
    mydb.close()

    rows_dict = dict((str(x), y) for x, y in rows)
    s = pd.Series(rows_dict)

    idx = pd.date_range(s.index.min(), s.index.max())        
    s.index = pd.DatetimeIndex(s.index)

    s = s.reindex(idx, fill_value=0)

    df = pd.DataFrame({'ds': s.index, 'y': s.values})
    
    m = Prophet()
    m.fit(df)

    future = m.make_future_dataframe(periods=periods)
    forecast = m.predict(future)

    forecast_dict = forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']].tail(periods).set_index('ds').T.to_dict()
    forecast_dict = {str(k):v for k,v in forecast_dict.items()}

    return forecast_dict


