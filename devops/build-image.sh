#!/bin/bash

echo 'Building Front End Docker image'
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
REPO_DIR=$(dirname $DIR)

DOCKER_IMAGE="softwaredaily/sedaily-frontend"

cp $DIR/ci.Dockerfile $REPO_DIR/ci.Dockerfile

docker build -f $REPO_DIR/ci.Dockerfile -t $DOCKER_IMAGE $REPO_DIR #--no-cache

rm $REPO_DIR/ci.Dockerfile

# must be part the organization
echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin

docker push $DOCKER_IMAGE

echo 'Front end image pushed to Docker hub'
