# Monad Internal

For accelerating development operations. 

## Asset Management Automation

Apart from user botfiles, several other Monad assets are maintained on S3. Asset management automation allows us to quickly build the latest versions of these assets and upload these updated files to the bucket on S3. 

**Setup**

This functionality requires the Amazon Web Services command line interface, `aws`. 

If you have this binary globally accessible, you are good to go. 

If you would prefer to not install the command-line interface globally, you can initialize a virtual environment in the `internal/` directory and run the automation scripts from within this environment. To accomplish this:

* Navigate to the directory `cd internal`
* Create a new environment `virtualenv env` 
* Activate the environment `source env/bin/active`
* Install packages within environment `pip install -r requirements.txt`

With this setup in place, all of the commands below should be available to you.

**Scripts**

`npm run devkit`

Creates an archive of the current development kit (maintained in the `devkit/`) and uploads it to the the Monad assets bucket on S3. 

`npm run visualizer` 

Builds the current offline visualizer application (maintained in the `visualizer/` directory) and uploads it to the Monad assets bucket on S3.

`npm run assets` 

Combines the functionality of both of the above commands to ensure that all live assets are up to date. 
