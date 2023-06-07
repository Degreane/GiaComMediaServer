#!/usr/bin/env bash

# Collect Ifaces 
IFACES=`ip -j add sh| jq -a -M '.[] | select( .ifname != "lo" and (.ifname |contains("docker") == false)  and (.ifname | contains("veth") == false ))| .ifname'`

# Add Security Bounds in the iptables firewall
IPtables=`which iptables`
sudo ${IPtables} -F 
for iFace in ${IFACES} ; do 
    sudo ${IPtables} -A INPUT -i ${iFace//\"/} -p tcp --dport 27017 -j DROP
done

## Do Redis 
[ `systemctl is-active redis.service` == 'active' ] || sudo systemctl start redis.service

## Do Docker
[ `systemctl is-active docker.service` == 'active' ] || sudo systemctl start docker.service

## Start Database
[ `docker inspect giacomMongo | jq -a -M '.[0]["State"]["Running"] '` == 'true' ] ||  docker start giacomMongo 

## Start/Restart server
## Better way to integrate process management (To Be Implemented later )
## ps -aux | jq -sR '[sub("\n$";"") | splits("\n") | sub("^ +";"") | [splits(" +")]] | .[0] as $header | .[1:] | [.[] | [. as $x | range($header | length) | {"key": $header[.], "value": $x[.]}] | from_entries]' 
## Switch to pm2 instead of forever 
##[ `ps -ef | grep node | grep GiaComMediaServer | wc -l` -eq 1 ] && forever restart 0 || forever start -a -l forever.log -o out.log -e err.log ./bin/www

status=`pm2 jlist | jq -aM '.[]| select(.name == "giacomMediaServer")| .pm2_env | .status '`; if [[ "${status}m" != "\"online\"m" ]]; then echo "Starting GiaCom Media Server "; pm2 start bin/www --name giacomMediaServer --watch ./ --ignore-watch ./node_modules ;else echo "Restarting GiaCom Media Server";pm2 restart giacomMediaServer; fi