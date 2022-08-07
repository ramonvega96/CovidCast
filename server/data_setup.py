import requests
import json
import mysql.connector

mydb = mysql.connector.connect(
    host='localhost',
    user='covidcastuser',
    password='newpassword',
    database='covidcast'
)

mycursor = mydb.cursor()


def setup_infections_table():

    mycursor.execute('DROP TABLE IF EXISTS infections')

    create_query = '''CREATE TABLE infections (
            _id INTEGER PRIMARY KEY,
            NOTIFICATION_DATE TIMESTAMP,
            HHS VARCHAR(255),
            POSTCODE INTEGER,
            LGA_NAME VARCHAR(255),
            SOURCE_INFECTION VARCHAR(500))'''

    mycursor.execute(create_query)


def fetch_load_infections_data():

    print('Data load process started')
    response = requests.get('https://www.data.qld.gov.au/api/3/action/datastore_search?resource_id=1dbae506-d73c-4c19-b727-e8654b8be95a&limit=100000')  

    content = json.loads(response.content.decode('utf-8'))
    result = content['result']
    tpls = []
    num_records = 0

    while result['records']:
        for i in result['records']:
            tpls.append(build_tpl(i))
            num_records += 1       
        
        insert_infections_list(tpls)
        print('Inserted records: ' + str(num_records))
        
        next_url = 'https://www.data.qld.gov.au' + result['_links']['next']    
        response = requests.get(next_url)
        content = json.loads(response.content.decode('utf-8'))
        result = content['result']
        tpls = []

    print('Data load completed')


def build_tpl(obj):
    return str(obj['_id']), obj['NOTIFICATION_DATE'], obj['HHS'], obj['POSTCODE'], obj['LGA_NAME'], obj['SOURCE_INFECTION']


def insert_infections_list(infections_list):
    sql = '''INSERT IGNORE INTO infections
        (_id, NOTIFICATION_DATE, HHS, POSTCODE, LGA_NAME, SOURCE_INFECTION) 
        VALUES(%s, %s, %s, %s, %s, %s)'''
    
    mycursor.executemany(sql, infections_list)
    mydb.commit()


def setup_by_lga_and_date():
    
    mycursor.execute('DROP TABLE IF EXISTS lga_infections')

    create_query =  '''CREATE TABLE lga_infections (
            LGA_NAME VARCHAR(255),
            NOTIFICATION_DATE TIMESTAMP,
            INFECTIONS_COUNT INTEGER)'''

    mycursor.execute(create_query)
    
    mycursor.execute(
        'INSERT INTO lga_infections ' +
        'SELECT lga_name, notification_date, count(*) as infections_count ' +
        'FROM infections ' +
        'GROUP BY lga_name, notification_date ' +
        'ORDER BY lga_name, notification_date')
    
    mydb.commit()
    mycursor.close()
    mydb.close()

    print('lga_infections table created.')


if __name__ == '__main__':
    setup_infections_table()
    fetch_load_infections_data()
    setup_by_lga_and_date()
