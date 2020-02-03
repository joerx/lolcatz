REPO ?= $(shell git remote get-url origin | sed 's/.*github\.com[\/:]\{1\}//' | sed 's/\.git$$//')
TAG ?= $(shell git rev-parse --short HEAD)

ifdef DOCKER_REGISTRY
	IMAGE := $(DOCKER_REGISTRY)/$(REPO):$(TAG)
else
	IMAGE := $(REPO):$(TAG)
endif

docker-build:
	docker build -t $(IMAGE) .

docker-push:
	docker push $(IMAGE)

build:
	npm run build

clean:
	rm -rf build

.PHONY: clean build build-image
