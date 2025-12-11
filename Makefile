build-dev:
	docker compose -f docker-compose.dev.yml up --build -d --remove-orphans

down-dev:
	docker compose -f docker-compose.dev.yml down

build-prod:
	docker compose -f docker-compose.prod.yml up --build -d --remove-orphans

down-prod:
	docker compose -f docker-compose.prod.yml down