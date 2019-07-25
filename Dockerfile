FROM ubuntu:xenial

LABEL "com.github.actions.name"="Velocity deploy action"
LABEL "com.github.actions.description"="A simple GitHub action for tracking deploys on Velocity by Code Climate"
LABEL "com.github.actions.icon"="mic"
LABEL "com.github.actions.color"="purple"

LABEL "repository"="http://github.com/codeclimate/velocity-deploy-action"
LABEL "homepage"="https://codeclimate.com"
LABEL "maintainer"="Code Climate <help@codeclimate.com>"

RUN apt-get --quiet --yes update && \
    apt-get --quiet --yes install curl

ADD entrypoint.sh /entrypoint.sh
RUN ["/entrypoint.sh"]
