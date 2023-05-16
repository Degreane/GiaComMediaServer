#!/usr/bin/env bash

## Do Redis 
[ `systemctl is-active redis.service` == 'active' ] || sudo systemctl start redis.service

## Do Docker
[ `systemctl is-active docker.service` == 'active' ] || sudo systemctl start docker.service

## Start Database
[ `docker inspect giacomMongo | jq -a -M '.[0]["State"]["Running"] '` == 'true' ] ||  docker start giacomMongo 

## Start/Restart server
[ `ps -ef | grep node | grep GiaComMediaServer | wc -l` -eq 1 ] && forever restart 0 || forever start -a -l forever.log -o out.log -e err.log ./bin/www
