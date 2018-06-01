#!/bin/bash

# sample-hash.sh
# Hash the sample devkit archive and write results to file for validation.

sed -i '.bak' "s/.*devkit.zip$/$(shasum -a 256 devkit.zip)/" ../docs/downloads/hash.md

# remove the auto-generated backup file
rm -f ../docs/downloads/hash.md.bak

cd ../docs
npm run deploy

exit 0;
