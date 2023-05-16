[ `systemctl is-active redis.service` == 'active' ] || sudo systemctl start redis.service
[ `systemctl is-active docker.service` == 'active' ] || sudo systemctl start docker.service
docker start giacomMongo 
forever start -a -l forever.log -o out.log -e err.log ./bin/www
