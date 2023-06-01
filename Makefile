docker-build:
	docker image build --platform linux/amd64 -t cmtttbrother/66k-rtn-intelligence .

docker-push:
	docker image push cmtttbrother/66k-rtn-intelligence

docker-run:
	docker run -d -p 7123:3100 cmtttbrother/66k-rtn-intelligence