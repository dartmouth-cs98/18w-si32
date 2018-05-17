# Monad Bot Development Kit

Everything you need to get started developing for Monad!

### Overview

All of the functionality of the development kit is accessible through the
`monad.sh` script. This script serves as a wrapper around the various types of
actions available to you in the development kit - simplify specify the command
as the argument to the script, along with any necessary parameters, and the script
takes care of the dispatch of the relevant action for you.

The development kit allows you to

* Run a single local match
* Train your bot by running many local matches in succession and reporting metadata
* Upload a new bot to the Monad servers

See below for details on each of these available actions.

### Setup

We highly recommend utilizing the Monad development kit in conjunction
with python virtual environments to simplify the installation and maintenance
of dependencies. Instructions for setting up a virtual environment in your
local development directory are provided below.

Ensure that you have `pip` installed; if you installed python using Homebrew,
`pip` should have been installed as well. Verify this with

```
$ pip --version
```

You should be met with version information output in the console.

Once `pip` is installed, install the `virtualenv` package globally with

```
$ pip install virtualenv
```

As before, verify that your installation succeeded with

```
$ virtualenv --version
```

Now initialize a virtual environment in your development directory:

```
$ cd devkit/
$ virualenv env
```

The above command creates a virtual environment called `env`. You can name your
environment whatever you wish, but the remainder of these instructions assume that
the environment is called `env`.

Now activate your virtual environment with

```
$ source env/bin/activate
```

Finally, install the packages required for local development with

```
$ pip install -r requirements.txt
```

And you're ready to roll.

### Run a Single Match

Run a single match with 2-4 local bots.

**Usage**

```
$ monad.sh match [-h] [-u] botfiles [botfiles ...]
```

```
positional arguments:
  botfiles           paths to botfiles

optional arguments:
  -h, --help         show this help message and exit
  -u, --uniform-map  specify use of uniform map
```

### Train a Bot over Multiple Iterations

Run multiple matches in succession, and output the results metadata once
all matches have been completed. By default, no logfiles are written.

**Usage**

```
$ monad.sh train [-h] [-n ITERS] [-u] botfiles [botfiles ...]
```

```
positional arguments:
  botfiles              paths to botfiles

optional arguments:
  -h, --help            show this help message and exit
  -n ITERS, --num-iterations ITERS
                        specify number of match iterations
  -u, --uniform-map     specify use of uniform map
```

### Upload a Botfile

Upload a botfile to the Monad servers.

**Usage**

```
$ monad.sh upload [-h] [-d] botfile
```

```
positional arguments:
  botfile            path to botfile

optional arguments:
  -h, --help         show this help message and exit
  -d, --development  specify development mode
```
