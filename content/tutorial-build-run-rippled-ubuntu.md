# Build and Run `rippled` on Ubuntu

`rippled` is the core peer-to-peer server that manages the XRP Ledger. A `rippled` server can connect to a network of peers, relay cryptographically signed transactions, and maintain a local copy of the complete shared global ledger.

For an overview of `rippled`, see [Operating rippled Servers](tutorial-rippled-setup.html).

Use these instructions to build a `rippled` executable from source version 0.90.0 or higher on Ubuntu Linux 16.04 or higher. These instructions were tested on Ubuntu 16.04 LTS.

For information about building `rippled` for other platforms, see [Builds](https://github.com/ripple/rippled/tree/develop/Builds) in the `rippled` GitHub repository.


## System Requirements

**_To build `rippled`:_**

You need a **minimum** of 8GB of RAM.

**_To run `rippled`:_**

Meet these [system requirements](tutorial-rippled-setup.html#minimum-system-requirements).


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

5. Install `pkg-config`.

        sudo apt-get -y install pkg-config

6. Install Protocol Buffers.

        sudo apt-get -y install protobuf-compiler
        sudo apt-get -y install libprotobuf-dev

7. Install Secure Socket Layer (SSL) toolkit development files.

        sudo apt-get -y install libssl-dev

8. Install `wget` to be able to download Boost in the next step.

        sudo apt-get -y install wget

9. Compile Boost.

    Starting in `rippled` 0.90.0, the recommended Boost version is 1.64.0. Because Boost version 1.64.0 isn't available in the Ubuntu 16.04 repos, you must compile it yourself.

      a. Download Boost 1.64.0.

          wget https://dl.bintray.com/boostorg/release/1.64.0/source/boost_1_64_0.tar.gz

      b. Untar `boost_1_64_0.tar.gz`.

          tar xvzf boost_1_64_0.tar.gz

      c. Access the new `boost_1_64_0` directory:

          cd boost_1_64_0

      d. To prepare the Boost.Build system for use, run:

          ./bootstrap.sh

      e. To invoke Boost.Build to build the separately-compiled Boost libraries, run the following command. Replace `<number of jobs>` with the number of job, or commands, to run in parallel. This may take about 15 minutes, depending on your hardware specs.

          ./b2 -j <number of jobs>

      f. Set the environment variable `BOOST_ROOT` to point to the new `boost_1_64_0` directory. It's best to put this environment variable in your `.profile`, or equivalent, file for your shell so it's automatically set when you log in. Add the following line to the file:

          export BOOST_ROOT=/home/ubuntu/boost_1_64_0

      g. Source your updated `.profile` file. For example:

          source ~/.profile

10. Get `rippled` source code.

        git clone https://github.com/ripple/rippled.git
        cd rippled
        git checkout master

11. If you previously built, or (more importantly) tried and failed to build `rippled`, you should delete the `build/` directory to start clean before moving on to the next step. Otherwise, you may get unexpected behavior, like a `rippled` executable that crashes due to a segmentation fault (segfault).

    If this is your first time building `rippled,` you won't have a `build/` directory and can move on to the next step.

12. Build a `rippled` binary executable from source code. This may take about 20 minutes, depending on your hardware specs.

        scons

    SCons saves the built executable in `rippled/build`.

13. _(Optional)_ Run `rippled` unit tests. If there are no test failures, you can be fairly certain that your `rippled` executable compiled correctly.

        ./rippled -u


## 2. Configure `rippled`

Complete the following configurations that are required for `rippled` to start up successfully. All other configuration is optional and can be tweaked after you have a working server.

1. Create a copy of the example config file (assumes you're in the `rippled` folder already). Saving the config file to this location enables you to run `rippled` as a non-root user (recommended).

        mkdir -p ~/.config/ripple
        cp doc/rippled-example.cfg ~/.config/ripple/rippled.cfg

2. Edit the config file to set necessary file paths. The user you plan to run `rippled` as must have write permissions to all of the paths you specify here.

    1. Set the `[node_db]`'s path to the location where you want to store the ledger database.

    2. Set the `[database_path]` to the location where you want to store other database data. (This includes an SQLite database with configuration data, and is typically one level above the `[node_db]` path field.)

    3. Set the `[debug_logfile]` to a path where `rippled` can write logging information.

3. Copy the example `validators.txt` file to the same folder as `rippled.cfg`:

        cp doc/validators-example.txt ~/.config/ripple/validators.txt

    **Warning:** Ripple has designed a [decentralization plan](https://ripple.com/dev-blog/decentralization-strategy-update/) with maximum safety in mind. During the transition, you *should not* modify the `validators.txt` file except as recommended by Ripple. Even minor modifications to your validator settings could cause your server to diverge from the rest of the network and report out of date, incomplete, or inaccurate data. Acting on such data can cause you to lose money.

## 3. Run `rippled`

To run your stock `rippled` server from the executable you built, using the configurations you defined:
```
cd build
./rippled
```


### What to Expect

Once you've run `rippled`, here are excerpts of what you can expect to see in your terminal.

```
Loading: "/home/ubuntu/.config/ripple/rippled.cfg"
Watchdog: Launching child 1
2018-Jan-31 20:19:40 JobQueue:NFO Auto-tuning to 4 validation/transaction/proposal threads.
2018-Jan-31 20:19:40 Amendments:DBG Amendment 4C97EBA926031A7CF7D7B36FDE3ED66DDA5421192D63DE53FFB46E43B9DC8373 is supported.
2018-Jan-31 20:19:40 Amendments:DBG Amendment 6781F8368C4771B83E8B821D88F580202BCB4228075297B19E4FDC5233F1EFDC is supported.
...
2018-Jan-31 20:19:40 OrderBookDB:DBG Advancing from 0 to 3
2018-Jan-31 20:19:40 OrderBookDB:DBG OrderBookDB::update>
2018-Jan-31 20:19:40 OrderBookDB:DBG OrderBookDB::update< 0 books found
2018-Jan-31 20:19:40 ValidatorList:DBG Loading configured trusted validator list publisher keys
2018-Jan-31 20:19:40 ValidatorList:DBG Loaded 1 keys
2018-Jan-31 20:19:40 ValidatorList:DBG Loading configured validator keys
...
2018-Jan-31 20:19:40 LedgerConsensus:NFO Entering consensus process, watching, synced=no
2018-Jan-31 20:19:40 LedgerConsensus:NFO Consensus mode change before=observing, after=observing
...
2018-Jan-31 20:19:40 Application:FTL Startup RPC:
{
	"command" : "log_level",
	"severity" : "warning"
}
...
2018-Jan-31 20:20:32 NetworkOPs:WRN We are not running on the consensus ledger
2018-Jan-31 20:20:32 LedgerConsensus:WRN Need consensus ledger 17F251A5AD7120BD0D3ED9EB1B45598AACA1D76EA67C7FFC3384E629C25E198B
2018-Jan-31 20:20:35 NetworkOPs:WRN We are not running on the consensus ledger
2018-Jan-31 20:20:35 LedgerConsensus:WRN Need consensus ledger 0EAEFBC6C63DE7CEA32415336C7524D50E2531781704CE86895EAF84A63477D7
...
2018-Jan-31 20:20:53 LedgerConsensus:WRN View of consensus changed during establish status=establish,  mode=wrongLedger
2018-Jan-31 20:20:53 LedgerConsensus:WRN E5C6EF6AB5C1DB0EA5EF1C43C2EDC1179459FBAC5ABDF6523F488DEE276FA9E6 to 7F0E5EE15F8FC41776BA230094C364DE045C35A15073C9E057407506A9E53892
2018-Jan-31 20:20:53 LedgerConsensus:WRN {"accepted":true,"account_hash":"8EE80E7E8ADCE2AB550611752BC4EC748D9DFEBB4B4B98F05BD5F6147CF61ED5","close_flags":0,"close_time":570745240,"close_time_human":"2018-Jan-31 20:20:40","close_time_resolution":20,"closed":true,"hash":"9FA1BAF2A4F6A908B10303E6624E175CCD53D1E87E6B44D09FC28E8FCC63D3C3","ledger_hash":"9FA1BAF2A4F6A908B10303E6624E175CCD53D1E87E6B44D09FC28E8FCC63D3C3","ledger_index":"8","parent_close_time":570745234,"parent_hash":"9AF26062D241A16EDD8436EB1A9B533281D43949A7DA2E4F35A50110537BD596","seqNum":"8","totalCoins":"100000000000000000","total_coins":"100000000000000000","transaction_hash":"0000000000000000000000000000000000000000000000000000000000000000"}
```


## Explore Next Steps

* Now that you have a stock `rippled` server running, you may want to consider running it as a validating server. For information about validating servers and why you might want to run one, see the [rippled Setup Tutorial](tutorial-rippled-setup.html).

* For information about communicating with your `rippled` server using the `rippled` API, see the [`rippled` API reference](reference-rippled.html).

* As a development best practice, you may want to build a `rippled` `.deb` file. For more information, see _Ubuntu Packaging Guide_: [Packaging New Software](http://packaging.ubuntu.com/html/packaging-new-software.html).

* You may also want to install a `systemd` unit. For more information, see [systemd for Upstart Users](https://wiki.ubuntu.com/SystemdForUpstartUsers). You can use the [official `rippled` system unit file](https://github.com/ripple/rippled-package-builder/blob/staging/rpm-builder/rippled.service) or modify it to suit your needs.
