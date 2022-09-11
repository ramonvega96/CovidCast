import pandas as pd
from prophet import Prophet
import mysql.connector


def predict(lga_name, periods):
    mydb = mysql.connector.connect(
        host='covidcastdb',
        user='root',
        password='test',
        database='covidcast'
    )

    my_cursor = mydb.cursor()

    my_cursor.execute("""SELECT notification_date, infections_count 
                        FROM lga_infections where lga_name='""" + lga_name + """' order by notification_date""")

    rows = my_cursor.fetchall()

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

    my_cursor.close()
    mydb.close()

    return forecast_dict


