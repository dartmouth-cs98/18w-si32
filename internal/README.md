# Monad Internal

For accelerating development operations.

### Asset Management Automation

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

```
npm start
```

Combines the functionality of both of the commands below to ensure that all live assets are up to date.

Note: because one of the dependent tasks (visualizer) takes some time, this one will as well.

```
npm run devkit
```

Creates an archive of the current development kit (maintained in the `devkit/`) and uploads it to the the Monad assets bucket on S3.

Subtasks

* `devkit-rm` Remove the existing devkit archive from S3 bucket.
* `devkit-zip` Archive the current local devkit directory.
* `devkit-hash` Generate the hash checksum for updated devkit and update documentation with this new value.
* `devkit-cp` Upload the new devkit archive to S3 bucket.
* `devkit-clean` Remove the locally-generated devkit archive.

```
npm run visualizer
```

Builds the current offline visualizer application (maintained in the `visualizer/` directory) and uploads it to the Monad assets bucket on S3.

Note: this task initiates a fresh build of the entire Electron app, so it takes some time.

Subtasks

* `visualizer-rm` Remove the existing visualizer disk image file from S3 bucket.
* `visualizer-build` Initiate new build of the visualizer.
* `visualizer-hash` Generate the hash checksum for updated visualizer and update documentation with this new
value.
* `visualizer-cp` Upload the new visualizer disk image file to S3 bucket.

```
npm run sample
```

Generates obfuscated versions of our sample bots, creates archives for each, and uploads them
to the Monad assets bucket on S3 (in the `sample/` subdirectory).

Subtasks

* `sample-rm` Remove the existing sample bot archives from S3 bucket.
* `sample-obfuscate` Generate obfuscated versions of source for sample bots.
* `sample-zip` Archive the current versions of each sample bot, with obfuscated source.
* `sample-hash` Generate the hash checksum for updated sample bot archives and update documentation with
these new values.
* `sample-cp` Upload the new sample bot archives to S3 bucket.
* `sample-clean` Remove the locally generated sample bot archives. 
