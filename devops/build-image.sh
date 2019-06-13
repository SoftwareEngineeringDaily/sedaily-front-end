#!/bin/bash

echo "TEST_VAR: ${TEST_VAR}"
if [[ -z $1 ]]; then
	TAG="develop"
else
	TAG=$1
fi

echo 'Building Front End Docker image'
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
REPO_DIR=$(dirname $DIR)

DOCKER_IMAGE="softwaredaily/sedaily-frontend:$TAG"

cp $DIR/ci.Dockerfile $REPO_DIR/ci.Dockerfile

docker build -f $REPO_DIR/ci.Dockerfile -t $DOCKER_IMAGE $REPO_DIR #--no-cache

rm $REPO_DIR/ci.Dockerfile

# must be part the organization
echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin

docker push $DOCKER_IMAGE

echo 'Front end image pushed to Docker hub'
