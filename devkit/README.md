# Monad Bot Development Kit

Everything you need to get started developing for Monad!

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
