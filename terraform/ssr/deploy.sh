echo "[deploy] start"

PROJECT=calories-log.net

# Docker, git 설치
sudo yum -y upgrade
git --version || sudo yum -y install git
docker -v || sudo yum -y install docker

# Docker 실행
sudo docker ps || sudo service docker start

# Dockerfile 가져오기
cp /tmp/Dockerfile ./Dockerfile
cp /tmp/target.tar.gz ./target.tar.gz

# green 폴더에 풀기
rm -rf $PROJECT-green
mkdir $PROJECT-green
cd $PROJECT-green

tar -zxf ../target.tar.gz -C .

rm -rf ../target.tar.gz &

cp ../Dockerfile .

# green 빌드
sudo docker build -t nextjs-runner:green \
  --build-arg NOTION_SECRET=$NOTION_SECRET \
  --build-arg NOTION_DATABASE=$NOTION_DATABASE \
  --build-arg NOTION_STORAGE_DATABASE=$NOTION_STORAGE_DATABASE \
  --build-arg MASTER_PW=$MASTER_PW \
  --build-arg MASTER_ID=$MASTER_ID .

# blue 제거
sudo docker ps
sudo docker stop $(sudo docker ps -a | grep nextjs-runner:blue | awk '{ print $1 }')
sudo docker rm $(sudo docker ps -a | grep nextjs-runner:blue | awk '{ print $1 }')
sudo docker rmi nextjs-runner:blue

# green => blue
sudo docker tag nextjs-runner:green nextjs-runner:blue

# blue 실행
sudo docker run -d -p 80:3000 nextjs-runner:blue

# green 제거
sudo docker rmi nextjs-runner:green &

echo "[deploy] done"
