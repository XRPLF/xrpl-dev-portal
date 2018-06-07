# rippled Commandline Usage Reference

The `rippled` executable usually runs as a daemon that powers the XRP Ledger, although it can also run in other modes. This page describes all the options you can pass to `rippled` when running it from the command line.

## Available Modes

- **Daemon Mode** - The default. Connect to the XRP Ledger to process transactions and build a ledger database.
- **Stand-Alone Mode** - Use the `-a` or `--standalone` option. Like daemon mode, except it does not connect to other servers. You can use this mode to test transaction processing or other features.
- **Client Mode** - Connect to another `rippled` server as a JSON-RPC client, then exit. You can use this to look up server status and ledger data if the executable is already running in another process.
- **Version statement** - Use `--version` to have `rippled` print its version number, then exit.
- **Unit Tests** - Use `-u` or `--unittest` to run unit tests, print a summary of results, then exit. Use this to confirm that the process compiled correctly.
- **Help** - Print a usage statement, then exit.


## Basic Information

### Usage Statement

```bash
rippled --help
rippled -h
```

Display a usage statement with available options, then exit.

### Unit Testing

```bash
rippled --unittest
rippled -u
```

Takes optional arguments ***TODO: what args why?***

## Daemon Mode

| Option | Short Version | Description |
|---|---|---|
| `--conf {FILE}` | | Use `{FILE}` as the configuration file instead of looking for config files in the default locations. ***TODO: list default config file paths in priority order*** |
| `--fg` | | Run in the foreground instead of as a background process. ***TODO: does this work? rippled always runs in the foreground for me. --mDuo13*** |
| `--import` | | Import ledger data from another `rippled` server's ledger store. Requires a valid `[import_db]` stanza in the config file. |
| `--ledger {LEDGER}` |  | Load the ledger version identified by `{LEDGER}` (either a ledger hash or a ledger index) as the initial ledger. ***TODO: this is more useful in stand-alone but can be used in both, I think? Maybe reconsider the organization of options...*** |
| `--ledgerfile {FILE}` | | Load the ledger version from the specified `{FILE}`. ***TODO: what sort of file should this be? where does it come from?*** |
| `--load` |  | Load the initial ledger from the ledger store on disk. ***TODO: isn't this the default behavior anyway?*** |
| `--net` |  | Load the initial ledger from the network. ***TODO: In what circumstances is this meaningfully different from `--load`?*** |
| `--nodetoshard` | | Before fully starting, copy any complete [history shards](history-sharding.html) from the ledger store into the shard store, up to the shard store's configured maximum disk space. Uses large amounts of CPU and I/O. Caution: this command copies data (instead of moving it), so you must have enough disk space to store the data in both the shard store and the ledger store. <!--{# TODO: make a tutorial for this? #}--> |
| `--quorum {QUORUM}` | (None) | Override the minimum quorum for validation by requiring a agreement of `{QUORUM}` trusted validators. ***TODO: is this even honored anymore?*** |
| `--start` |  | Create a new genesis ledger to use as the initial ledger. |
| `---valid` |  | Consider the initial ledger a valid network ledger. ***TODO: clarify how this is different from the default and why you might use it.*** |


### Logging Options

| Option | Short Version | Description |
|---|---|---|
| `--debug` |  | Print debug-level logging. ***TODO: to stdout and/or logs?*** |
| `--quiet` | `-q` | Print fewer messages to standard out. ***TODO: and logs?*** |
| `--silent` |  | After logging, print less to standard output. ***TODO: comparison with -q?*** |
| `--verbose` | `-v` | Print more information (***TODO: how much?***) to logs and standard output. |
