GIT_REPO ?= $(shell git remote get-url origin | sed 's/.*github\.com[\/:]\{1\}//' | sed 's/\.git$$//')
VERSION ?= $(shell git rev-parse --short HEAD)-dev
NAME ?= webapp
API_URL ?= http://localhost:8000

ifdef DOCKER_REGISTRY
	IMAGE_TAG := $(DOCKER_REGISTRY)/$(GIT_REPO)/$(NAME):$(VERSION)
else
	IMAGE_TAG := $(GIT_REPO)/$(NAME):$(VERSION)
endif

build:
	docker build -t $(IMAGE_TAG) --build-arg API_URL=$(API_URL) .

publish:
	docker push $(IMAGE_TAG)

.PHONY: clean build publish
