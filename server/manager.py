import mysql.connector


def get_all_infections_count():
    mydb = mysql.connector.connect(
        host='covidcastdb',
        user='root',
        password='test',
        database='covidcast'
    )

    my_cursor = mydb.cursor()

    resp = {}

    try:
        my_cursor.execute("""SELECT LGA_NAME, sum(INFECTIONS_COUNT) FROM covidcast.lga_infections 
                                                                    WHERE LGA_NAME <> '' group by LGA_NAME;""")
        rows = my_cursor.fetchall()
        rows_dict = dict((str(x), int(y)) for x, y in rows)
        arr = []

        for i in rows_dict:
            my_cursor.execute("""SELECT INFECTIONS_COUNT FROM covidcast.lga_infections 
                                            WHERE LGA_NAME='""" + i + """' order by NOTIFICATION_DATE desc;""")

            infections_list = my_cursor.fetchall()

            if rows_dict[i] > 1000:
                obj = dict()
                obj["lga_name"] = i
                obj["infections_count"] = rows_dict[i]
                obj["mini_chart_data"] = list(reversed([x[0] for x in infections_list]))
                arr.append(obj)

        resp = {"data": arr}
        my_cursor.close()
        mydb.close()

    except Exception as e:
        resp = {"Internal Error": str(e)}
        my_cursor.close()
        mydb.close()

    return resp





if __name__ == "__main__":
    print(get_all_infections_count())

