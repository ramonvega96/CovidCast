# For more information, please refer to https://aka.ms/vscode-docker-python
FROM python:3.9
WORKDIR /app
ENV FLASK_APP=server.py
ENV FLASK_RUN_HOST=0.0.0.0
ENV FLASK_ENV=development
COPY requirements.txt requirements.txt
RUN python -m pip install -r requirements.txt
RUN apt update && apt-get install -y libtbb2
EXPOSE 5000
COPY . .
CMD ["flask", "run"]