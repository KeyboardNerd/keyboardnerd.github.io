# configure SSServer

1. Setup server in Japan, using CentOS:7.X
```
yum update
yum install docker
systemctl start docker
// verify docker status
docker ps
docker pull shadowsocks/shadowsocks-libev
// if you don't give a damn about security or this is only for temporary stuff do it here and using root
// don't worry this Password/port is not in production.
docker run -e PASSWORD=%zCkeCeqT67H -p 11291:8388 -p 11291:8388/udp -e METHOD=aes-256-gcm -d --restart always shadowsocks/shadowsocks-libev:latest
```
Since G=F-W wants to mess with the IP/ports, do run multiple instances of SS Server.
They're doing this hypothetically by checking connections grouped by IP and port, and freek'in the connections if they found it's encrypted and not whitelisted.

tip: Don't forget to change the SSH port and setup the firewall.
https://www.liberiangeek.net/2014/11/change-openssh-port-centos-7/
Damn fine SELinux

look, my temporary SS server root was tried 142 times within one day, I didn't even post the IP any where.

2. Optionally use SSH key to login, just to simplify login
Generate: https://help.github.com/articles/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent/
Add the public key to CentOS: https://www.digitalocean.com/community/tutorials/how-to-set-up-ssh-keys-on-centos7

If you don't want to do this manually, outline is your friend.
