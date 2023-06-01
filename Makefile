docker-build:
	docker image build -t cmtttbrother/66k-rtn-intelligence:${tag} .

docker-push:
	docker image push cmtttbrother/66k-rtn-intelligence:${tag}