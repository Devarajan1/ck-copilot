docker build -t hom-node:1 .
docker rm -f hom-node
docker run -itd --name hom-node -p 80:3001 hom-node:1
