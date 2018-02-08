all: worker child

worker: Dockerfile
	docker build -t si32-worker --build-arg API_ROUTE=$(API_ROUTE) .

child: child/Dockerfile
	cd child && docker build -t si32-child-bot .

clean:
	rm *.pyc
