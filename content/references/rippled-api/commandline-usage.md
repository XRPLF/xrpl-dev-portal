# rippled Commandline Usage Reference

The `rippled` executable usually runs as a daemon that powers the XRP Ledger, although it can also run in other modes. This page describes all the options you can pass to `rippled` when running it from the command line.

## Available Modes

- **Daemon Mode** - The default. Connect to the XRP Ledger to process transactions and build a ledger database.
- **Stand-Alone Mode** - Use the `-a` or `--standalone` option. Like daemon mode, except it does not connect to other servers. You can use this mode to test transaction processing or other features.
- **Client Mode** - Specify an API method name to connect to another `rippled` server as a JSON-RPC client, then exit. You can use this to look up server status and ledger data if the executable is already running in another process.
- **Other Usage** - Each of the following commands causes the `rippled` executable to print some information, then exit:
    - **Help** - Use `-h` or `--help` to print a usage statement.
    - **Unit Tests** - Use `-u` or `--unittest` to run unit tests and print a summary of results. This can be helpful to confirm that you have compiled `rippled` successfully.
    - **Version statement** - Use `--version` to have `rippled` print its version number, then exit.

## Generic Options

These options are apply to most modes:

| Option | Short Version | Description |
|---|---|---|
| `--conf {FILE}` | | Use `{FILE}` as the configuration file instead of looking for config files in the default locations. ***TODO: list default config file paths in priority order*** |

### Verbosity Options

The following generic options affect the amount of information written to standard output and log files:

| Option      | Short Version | Description                                    |
|:------------|:--------------|:-----------------------------------------------|
| `--debug`   |               | Print debug-level logging. ***TODO: to stdout and/or logs?*** |
| `--quiet`   | `-q`          | Print fewer messages to standard out. ***TODO: and logs?*** |
| `--silent`  |               | After logging, print less to standard output. ***TODO: comparison with -q?*** |
| `--verbose` | `-v`          | Print more information (***TODO: how much?***) to logs and standard output. |


## Daemon Mode Options

Daemon mode is the default mode of operation for `rippled`. In addition to the [Generic Options](#generic-options)

| Option              | Short Version | Description                            |
|:--------------------|:--------------|:---------------------------------------|
| `--fg`              |               | Run the daemon as a single process in the foreground. Otherwise, `rippled` forks a second process for the daemon while the first process runs as a monitor. |
| `--import`          |               | Before fully starting, import ledger data from another `rippled` server's ledger store. Requires a valid `[import_db]` stanza in the config file. |
| `--nodetoshard`     |               | Before fully starting, copy any complete [history shards](history-sharding.html) from the ledger store into the shard store, up to the shard store's configured maximum disk space. Uses large amounts of CPU and I/O. Caution: this command copies data (instead of moving it), so you must have enough disk space to store the data in both the shard store and the ledger store. <!--{# TODO: make a tutorial for this? #}--> |
| `--quorum {QUORUM}` |               | Override the minimum quorum for validation by requiring a agreement of `{QUORUM}` trusted validators. By default, the quorum for validation is automatically set to a safe number of trusted validators based on how many there are. This options is intended for bootstrapping [test networks](parallel-networks.html). If some validators are not online, this option can allow progress with a lower than normal quorum. **Warning:** If you set the quorum manually, it may be too low to prevent your server from diverging from the rest of the network. Only use this option if you have a deep understanding of consensus and have a need to use a non-standard configuration. |
| `---validateShards` |               | Validate an existing shard store. For more information see, [History Sharding](history-sharding.html). ***TODO: This means, what, to check it for consistency? Or to consider it valid?*** |

## Stand-Alone Mode Options

| Option         | Short Version | Description                                 |
|:---------------|:--------------|:--------------------------------------------|
| `--standalone` | `-a`          | Run in stand-alone mode. In this mode, `rippled` does not connect to the network or perform consensus. (Otherwise, `rippled` runs in daemon mode.) |
| `--replay`     |               | Replay a ledger close. ***TODO: Does this belong with the initial ledger options? How does this even work?*** |

### Initial Ledger Options

The following options determine which ledger to load first when starting up. These options are intended for replaying historical ledgers or bootstrapping test networks.

| Option                | Short Version | Description                          |
|:----------------------|:--------------|:-------------------------------------|
| `--ledger {LEDGER}`   |               | Load the ledger version identified by `{LEDGER}` (either a ledger hash or a ledger index) as the initial ledger. ***TODO: this is more useful in stand-alone but can be used in both, I think? Maybe reconsider the organization of options...*** |
| `--ledgerfile {FILE}` |               | Load the ledger version from the specified `{FILE}`. ***TODO: what sort of file should this be? where does it come from?*** |
| `--load`              |               | Load the initial ledger from the ledger store on disk. ***TODO: isn't this the default behavior anyway?*** |
| `--net`               |               | Load the initial ledger from the network. ***TODO: In what circumstances is this meaningfully different from `--load`?*** |
| `--start`             |               | Create a new genesis ledger to use as the initial ledger. |
| `---valid`            |               | Consider the initial ledger a valid network ledger. ***TODO: clarify how this is different from the default and why you might use it.*** |

## Client Mode

```bash
rippled [OPTIONS] -- {COMMAND} {COMMAND_PARAMETERS}
```

In client mode, the `rippled` executable acts as a client to another `rippled` service. (The service may be the same executable running in a separate process locally, or it could be a `rippled` server on another server.)

To run in client mode, provide the [commandline syntax](request-formatting.html#commandline-format) for one of the [`rippled` API](rippled-api.html) methods.

In addition to the individual command syntax, client mode accepts the [Generic Options](#generic-options) and the following options:

| Option                  | Short Version | Description                        |
|:------------------------|:--------------|:-----------------------------------|
| `--rpc`                 |               | Explicitly specify that the server should run in client mode. Not required. |
| `--rpc_ip {IP_ADDRESS}` |               | Connect to the `rippled` server at the specified IP Address. |
| `--rpc_port {PORT}`     |               | Connect to the `rippled` server on the specified port. |

**Tip:** Some arguments accept negative numbers as values. To ensure that arguments to API commands are not interpreted as options instead, pass the `--` argument before the command name.

Example usage (get account transaction history from the earliest available to latest available ledger versions):

```bash
rippled -- account_tx r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59 -1 -1
```


## Unit Tests

```bash
rippled --unittest
rippled -u
```

Unit testing runs tests built into the `rippled` source code to confirm that the executable performs as expected. This includes things like testing built-in data types and transaction processing routines.

If unit testing reports a failure, that generally indicates one of the following:

- A problem occurred when compiling `rippled` and it is not functioning as intended
- The source code for `rippled` contains a bug
- A unit test has a bug or has not been updated to account for new behavior

### Specific Unit Tests

```bash
rippled --unittest={TEST_OR_PACKAGE_NAME}
```

By default, `rippled` runs all unit tests except ones that are classified as "manual". You can run an individual test by specifying its name, or run a subset of tests by specifying a package name.

The `print` unit test is a special case that prints a list of available tests:

```bash
rippled --unittest=print
```

Tests are grouped into a hierarchy of packages separated by `.` characters and ending in the test case name.

Certain unit tests are classified as "manual" because they take too long to run. These tests are marked with `|M|` in the output of the `print` unit test. Manual tests do not run by default when you run all unit tests or a package of unit tests. You can run manual tests individually by specifying the name of the test. For example:

```bash
$ ./rippled --unittest=ripple.tx.OversizeMeta
ripple.tx.OversizeMeta
Longest suite times:
   60.9s ripple.tx.OversizeMeta
60.9s, 1 suite, 1 case, 9016 tests total, 0 failures
```
