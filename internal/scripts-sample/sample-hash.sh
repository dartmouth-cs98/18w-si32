#!/bin/bash

# sample-hash.sh
# Hash the sample bot archives and write results to file for validation.

cd ../sample

sed -i '.bak' "s/.*random.zip$/$(shasum -a 256 random.zip)/"        ../docs/sample/hash.md
sed -i '.bak' "s/.*streamer.zip$/$(shasum -a 256 streamer.zip)/"    ../docs/sample/hash.md
sed -i '.bak' "s/.*waiter.zip$/$(shasum -a 256 waiter.zip)/"        ../docs/sample/hash.md
sed -i '.bak' "s/.*fortifier.zip$/$(shasum -a 256 fortifier.zip)/"  ../docs/sample/hash.md

# remove the auto-generated backup file
rm -f ../docs/sample/hash.md.bak

cd ../docs
npm run deploy

exit 0;
