include env_config


default: build

dc-build:
	docker-compose build app

# ---------- Development ----------
start: dc-build
	docker-compose run --service-ports app run start

sh: dc-build
	docker-compose run --entrypoint=sh app

# ---------- Testing ----------
test: dc-build
	docker-compose run  app run test

build:
	docker build -t $(REGISTRY)$(SERVICE_NAME) .

# ------------Build-agent ----------------

BUILD_AGENT = $(SERVICE_NAME)-build-agent

build-agent:
	- docker rm -f $(BUILD_AGENT)
	docker build -t $(BUILD_AGENT) .

	#Lint
	docker run --rm --entrypoint=npm $(BUILD_AGENT) run lint

	#Test
	docker run --rm --entrypoint=npm $(BUILD_AGENT) run coverage
