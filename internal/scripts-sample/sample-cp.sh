#!/bin/bash

# sample-cp.sh
# Copy zip archives for our sample bots to S3 bucket. 

aws s3 cp ../sample/random.zip s3://monad-assets/sample/;
aws s3 cp ../sample/streamer.zip s3://monad-assets/sample/;
aws s3 cp ../sample/waiter.zip s3://monad-assets/sample/;
aws s3 cp ../sample/fortifier.zip s3://monad-assets/sample/;

exit 0;
