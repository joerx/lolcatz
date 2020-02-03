REPO ?= $(shell git remote get-url origin | sed 's/.*github\.com[\/:]\{1\}//' | sed 's/\.git$$//')
TAG ?= $(shell git rev-parse --short HEAD)
IMAGE_NAME ?= webapp

ifdef DOCKER_REGISTRY
	IMAGE := $(DOCKER_REGISTRY)/$(REPO)/$(IMAGE_NAME):$(TAG)
else
	IMAGE := $(REPO)/$(IMAGE_NAME):$(TAG)
endif

docker-build:
	docker build -t $(IMAGE) .

docker-push:
	docker push $(IMAGE)

build:
	npm run build

clean:
	rm -rf build

.PHONY: clean build docker-build docker-push
