# How to Start

## Database Start
```shell
docker run -p 5432:5432 \
-e POSTGRES_PASSWORD=<your-password> \
-v $PWD/data:/var/lib/postgresql/data \ # Persistence 
-v $PWD/init_db:/docker-entrypoint-initdb.d \ # Init script
-d postgres:9
```

## Backend Start
```shell
docker run -p 8000:3800 \
-e POSTGRE_PASS=<your-password> \
-e POSTGRE_HOST=<your-db-ip> -d backend:0.1.0
```

## Frontend Start
```shell
docker run -p 80:80 -d frontend:0.1.0
```
