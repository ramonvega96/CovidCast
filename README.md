# CovidCast

Docker and Docker Compose are prerequisites for installing and running CovidCast. This project can be installed and run in few steps after satisfiying the prerequisites.

### Step 1.

After cloning the repository, run the following command within ../CovidCast/
```
docker-compose up --build
```

### Step 2.

Populate the database by executing the following commands.
```
docker exec -it server bash
```

Now that you are in the server container. Execute the Python script for populating the database (performing the ETL process).
```
python3 data_setup.py
```

Now you should be able to go to localhost:80 in your browser and you should be able to see CovidCast live.
