all: child worker

worker: Dockerfile
	docker build -t si32-worker .

child: child/Dockerfile
	cd child && docker build -t si32-child-bot .

clean:
	rm *.pyc
