VOLUMES=mysqldata

run:
	mkdir -p ${VOLUMES}
	docker-compose up

fclean:
	rm -rf ${VOLUMES}/*
	rm -rf ${VOLUMES}
	docker-compose down -v
	docker system prune -a -f

re: fclean run
