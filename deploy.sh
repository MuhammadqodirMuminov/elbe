
cd /home/ubuntu/elbe

git pull origin main

docker-compose down

docker-compose up -d --build

docker image prune -f -a
