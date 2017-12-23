# Build and Run `rippled` on Ubuntu

`rippled` is the core peer-to-peer server that manages the XRP Ledger. A `rippled` server can connect to a network of peers, relay cryptographically signed transactions, and maintain a local copy of the complete shared global ledger.

For an overview of `rippled`, see [Operating rippled Servers](tutorial-rippled-setup.html).

Use these instructions to build a `rippled` binary file and run it as a stock `rippled` server on Ubuntu 15.04 or later. These instructions were tested on Ubuntu 16.04 LTS.

For information about building `rippled` for other platforms, see [Builds](https://github.com/ripple/rippled/tree/develop/Builds) in the `rippled` GitHub repository.


## System Requirements

**_To build `rippled`:_**

You need a **minimum** of 8GB of RAM.

**_To run `rippled`:_**

Meet these [system requirements](tutorial-rippled-setup.html#system-requirements).


## 1. Build `rippled`

These instructions use Ubuntu's APT (Advanced Packaging Tool) to install the software prerequisites you need to build and run `rippled`.

1. Update the list of packages that are available for `apt-get` to install or upgrade.

        sudo apt-get update

2. Upgrade currently installed packages.

        sudo apt-get -y upgrade

3. Install Git.

        sudo apt-get -y install git

4. Install SCons.

        sudo apt-get -y install scons

5. Install Ctags.

        sudo apt-get -y install ctags

6. Install `pkg-config`.

        sudo apt-get -y install pkg-config

7. Install Protocol Buffers.

        sudo apt-get -y install protobuf-compiler
        sudo apt-get -y install libprotobuf-dev

8. Install Secure Socket Layer (SSL) toolkit development files.

        sudo apt-get -y install libssl-dev

9. Install `python-software-properties`.

        sudo apt-get install -y python-software-properties

10. Install Boost.

        sudo add-apt-repository -y ppa:boost-latest/ppa
        sudo apt-get -y update
        sudo apt-get install -y libboost-all-dev

11. Get `rippled` source code.

        git clone https://github.com/ripple/rippled.git
        cd rippled
        git checkout master

12. Build `rippled` binary executable from source code. This may take about 30 minutes, depending on your hardware specs.

        scons

    SCons saves the built executable in `rippled/build`.


## 2. Configure `rippled`

Complete the following configurations that are required for `rippled` to start up successfully. All other configuration is optional and can be tweaked after you have a working server.

1. Create a copy of the example config file (assumes you're in the `rippled` folder already). Saving the config file to this location enables you to run `rippled` as a non-root user (recommended).

         cp doc/rippled-example.cfg ~/.config/ripple/rippled.cfg

2. Edit the config file to set necessary file paths. The user you plan to run `rippled` as must have write permissions to all of the paths you specify here.

    1. Set the `[node_db]`'s path to the location where you want to store the ledger database.

    2. Set the `[database_path]` to the location where you want to store other database data. (This includes an SQLite database with configuration data, and is typically one level above the `[node_db]` path field.)

    3. Set the `[debug_logfile]` to a path where `rippled` can write logging information.

3. Copy the example `validators.txt` file to the same folder as `rippled.cfg`:

        cp doc/validators-example.txt ~/.config/ripple/validators.txt

    **Warning:** Ripple has designed and [documented](https://ripple.com/dev-blog/decentralization-strategy-update/) a decentralization plan with maximum safety in mind. During the transition, you *should not* modify the `validators.txt` file except as recommended by Ripple. Even minor modifications to your validator settings could cause your server to diverge from the rest of the network and report out of date, incomplete, or inaccurate data. Acting on such data can cause you to lose money.

## 3. Run `rippled`

To run your stock `rippled` server from the executable you built, using the configurations you defined:
```
cd build
./rippled
```


### What to Expect

Once you've run `rippled`, here are excerpts of what you can expect to see in your terminal.

```
Loading: "/etc/opt/ripple/rippled.cfg"
Watchdog: Launching child 1
2017-Dec-15 18:27:37 JobQueue:NFO Auto-tuning to 4 validation/transaction/proposal threads for non-validator.
2017-Dec-15 18:27:37 Amendments:DBG Amendment C6970A8B603D8778783B61C0D445C23D1633CCFAEF0D43E7DBCD1521D34BD7C3 is supported.
2017-Dec-15 18:27:37 Amendments:DBG Amendment 4C97EBA926031A7CF7D7B36FDE3ED66DDA5421192D63DE53FFB46E43B9DC8373 is supported.
...
2017-Dec-15 18:27:37 ValidatorList:DBG Loading configured trusted validator list publisher keys
...
2017-Dec-15 18:27:37 ValidatorList:DBG Loading configured validator keys
...
2017-Dec-15 18:27:37 ValidatorSite:DBG Loading configured validator list sites
...
2017-Dec-15 18:27:38 LedgerConsensus:NFO Entering consensus process, watching, synced=no
...
2017-Dec-15 18:27:40 LedgerConsensus:WRN
{
	"accepted" : true,
	"account_hash" : "183D5235C7C1FB5AE67AD2F6CC3B28F5FB86E8C4F89DB50DD85641A96470534E",
	"close_flags" : 0,
	"close_time" : 566677650,
	"close_time_human" : "2017-Dec-15 18:27:30",
	"close_time_resolution" : 30,
	"closed" : true,
	"hash" : "014816C71F4B9AD5924AFBD7B02E0DF1522C4BC4BC45A69F97F51D4F2234FA10",
	"ledger_hash" : "014816C71F4B9AD5924AFBD7B02E0DF1522C4BC4BC45A69F97F51D4F2234FA10",
	"ledger_index" : "2",
	"parent_close_time" : 0,
	"parent_hash" : "AB868A6CFEEC779C2FF845C0AF00A642259986AF40C01976A7F842B6918936C7",
	"seqNum" : "2",
	"totalCoins" : "100000000000000000",
	"total_coins" : "100000000000000000",
	"transaction_hash" : "0000000000000000000000000000000000000000000000000000000000000000"
}
...
2017-Dec-15 18:27:50 NetworkOPs:WRN We are not running on the consensus ledger
2017-Dec-15 18:27:50 LedgerConsensus:WRN Need consensus ledger 8459443546CCBE4E89A41E1D0C17F24FBEA7B344C1ED6A26292B4C5CD19B4321
...
2017-Dec-15 18:38:28 OpenLedger:WRN Offer involves frozen asset
2017-Dec-15 18:38:31 LedgerConsensus:WRN Offer involves frozen asset
```


## Explore Next Steps

Now that you have a stock `rippled` server running, you may want to consider running it as a validating server. For information about validating servers and why you might want to run one, see the [rippled Setup Tutorial](tutorial-rippled-setup.html).

For information about communicating with your `rippled` server using the `rippled` API, see the [`rippled` API reference](reference-rippled.html).
