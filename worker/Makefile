.PHONY: all worker child
all: worker child

worker:
	cd .. && docker build -f worker/Dockerfile -t si32-worker --build-arg API_ROUTE=$(API_ROUTE) .

child:
	cd child && docker build -t si32-child-bot .

clean:
	rm *.pyc
