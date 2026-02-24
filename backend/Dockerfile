FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
# wait for postgres, then migrate and run server
CMD ["sh", "-c", "sleep 5 && python manage.py migrate && python manage.py runserver 0.0.0.0:8000"]
