from hashlib import new
import psycopg2
from config import config
import pandas as pd
from prophet import Prophet

def predict(lga_name, periods):

    conn = None
    rows = []

    try:
        params = config()
        conn = psycopg2.connect(**params)
        cur = conn.cursor()
        cur.execute("SELECT notification_date, infections_count FROM infections_data where lga_name='" + lga_name + "' order by notification_date")
        rows = cur.fetchall()
        cur.close()
    except (Exception, psycopg2.DatabaseError) as error:
        print(error)
    finally:
        if conn is not None:
            conn.close()

    rows_dict = dict((str(x), y) for x, y in rows)
    s = pd.Series(rows_dict)

    idx = pd.date_range(s.index.min(), s.index.max())        
    s.index = pd.DatetimeIndex(s.index)

    s = s.reindex(idx, fill_value=0)

    df = pd.DataFrame({'ds':s.index, 'y':s.values})
    
    m = Prophet()
    m.fit(df)

    future = m.make_future_dataframe(periods=periods)
    forecast = m.predict(future)

    forecast_dict = forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']].tail(periods).set_index('ds').T.to_dict()
    forecast_dict = {str(k):v for k,v in forecast_dict.items()}
      
    return forecast_dict
