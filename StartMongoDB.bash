[ `systemctl is-active redis.service` == 'active' ] || sudo systemctl start redis.service
[ `systemctl is-active docker.service` == 'active' ] || sudo systemctl start docker.service
[ `docker inspect giacomMongo | jq -a -M '.[0]["State"]["Running"] '` == 'true' ] ||  docker start giacomMongo 
[ `ps -ef | grep node | grep GiaComMediaServer | wc -l` -eq 1 ] || forever start -a -l forever.log -o out.log -e err.log ./bin/www
