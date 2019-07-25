#!/bin/sh

sh -c "echo $*"
curl \
  -d "token=${VELOCITY_DEPLOYMENT_TOKEN}" \
  -d "repository_url=https://github.com/${GITHUB_REPOSITORY}" \
  -d "revision=${GITHUB_SHA}" \
  -d "branch=${GITHUB_REF}" \
  -d "environment=${DEPLOY_ENVIRONMENT}" \
  -d "version=${DEPLOY_VERSION}" \
  https://velocity.codeclimate.com/deploys
