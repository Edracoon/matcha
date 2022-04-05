rm -rf mysqldata/* -y
docker-compose down -v
docker system prune -a -f
docker-compose up
