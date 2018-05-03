# Monad Bot Development Kit

Everything you need to get started developing for Monad!

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

### `match.sh`

Run a single match with 2-4 local bots.

**Usage**

```
match.sh [-h] [-u] botfiles [botfiles ...]

positional arguments:
  botfiles           paths to botfiles

optional arguments:
  -h, --help         show this help message and exit
  -u, --uniform-map  specify use of uniform map
```

### `train.sh`

Run multiple matches in succession, and output the results metadata once
all matches have been completed. By default, no logfiles are written.

**Usage**

```
train.sh [-h] [-n ITERS] [-u] botfiles [botfiles ...]

positional arguments:
  botfiles              paths to botfiles

optional arguments:
  -h, --help            show this help message and exit
  -n ITERS, --num-iterations ITERS
                        specify number of match iterations
  -u, --uniform-map     specify use of uniform map
```

### `upload.sh`

Upload a botfile to the Monad servers.

**Usage**

```
upload.sh [-h] [-d] botfile

positional arguments:
  botfile            path to botfile

optional arguments:
  -h, --help         show this help message and exit
  -d, --development  specify development mode
```
