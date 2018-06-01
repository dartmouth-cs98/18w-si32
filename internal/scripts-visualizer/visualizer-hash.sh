#!/bin/bash

# sample-hash.sh
# Hash the visualizer disk image file and write results to file for validation.

cd ../visualizer/dist/

sed -i '.bak' "s/.*monad-visualizer-0.1.0.dmg$/$(shasum -a 256 monad-visualizer-0.1.0.dmg)/" ../../docs/downloads/hash.md

# remove the auto-generated backup file
rm -f ../../docs/downloads/hash.md.bak

cd ../../docs
npm run deploy

exit 0;
