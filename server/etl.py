import requests
import json
import psycopg2
from config import config

def fetch_data():

    print("Data load process started")
    response = requests.get("https://www.data.qld.gov.au/api/3/action/datastore_search?resource_id=1dbae506-d73c-4c19-b727-e8654b8be95a&limit=100000")  

    content = json.loads(response.content.decode('utf-8'))
    result = content['result']
    tuples = []
    num_records = 0

    while result['records']:
        for i in result['records']:
            tuples.append(build_tuple(i))
            num_records += 1       
        
        insert_infections_list(tuples)
        print("Inserted records: " + str(num_records))
        next_url = "https://www.data.qld.gov.au" + result['_links']['next']    
        response = requests.get(next_url)
        content = json.loads(response.content.decode('utf-8'))
        result = content['result']
        tuples = []

    print("Data load completed")
    setup_by_lga_and_date()
        

def build_tuple(obj):
    return (str(obj["_id"]), obj["NOTIFICATION_DATE"], obj["HHS"], obj["POSTCODE"], obj["LGA_NAME"], obj["SOURCE_INFECTION"])


def insert_infections_list(infections_list):

    sql = "INSERT INTO infections(_id, NOTIFICATION_DATE, HHS, POSTCODE, LGA_NAME, SOURCE_INFECTION) VALUES(%s, %s, %s, %s, %s, %s) ON CONFLICT DO NOTHING"
    conn = None
    try:
        # read database configuration
        params = config()
        # connect to the PostgreSQL database
        conn = psycopg2.connect(**params)
        # create a new cursor
        cur = conn.cursor()
        # execute the INSERT statement
        cur.executemany(sql,infections_list)
        # commit the changes to the database
        conn.commit()
        # close communication with the database
        cur.close()
    except (Exception, psycopg2.DatabaseError) as error:
        print(error)
    finally:
        if conn is not None:
            conn.close()


def get_infections_count():
    
    conn = None
    try:
        params = config()
        conn = psycopg2.connect(**params)
        cur = conn.cursor()
        cur.execute("SELECT count(*) FROM infections")
        row = cur.fetchone()
        cur.close()
        return row[0]
    except (Exception, psycopg2.DatabaseError) as error:
        print(error)
    finally:
        if conn is not None:
            conn.close()


def setup_by_lga_and_date():
    
    conn = None
    try:
        params = config()
        conn = psycopg2.connect(**params)
        cur = conn.cursor()
        cur.execute("drop table if exists infections_data")
        cur.execute(
            "select lga_name, notification_date, count(*) as infections_count " +
            "into infections_data " +
            "from infections " +
            "group by lga_name, notification_date " +
            "order by lga_name, notification_date")
        conn.commit()
        cur.close()
    except (Exception, psycopg2.DatabaseError) as error:
        print(error)
    finally:
        if conn is not None:
            conn.close()

    print("infections_data table created.")



if __name__ == '__main__':
    fetch_data()
