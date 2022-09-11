rm -rf mysqldata/*
docker-compose down -v
# docker system prune -a -f
docker-compose up
