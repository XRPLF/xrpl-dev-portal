# Build and Run `rippled` on Ubuntu

`rippled` is the core peer-to-peer server that manages the XRP Ledger. A `rippled` server can connect to a network of peers, relay cryptographically signed transactions, and maintain a local copy of the complete shared global ledger.

For an overview of `rippled`, see [Operating rippled Servers](tutorial-rippled-setup.html).

Use these instructions to build a `rippled` 0.90.0+ binary file and run it as a stock `rippled` server on Ubuntu 15.04 or later. ***TODO: Question: I added the specific `rippled` release series to this text - is that okay? Should I remove the reference to Ubuntu 15.04 and just say that this is for Ubuntu 16.04 LTS or later?*** These instructions were tested on Ubuntu 16.04 LTS.

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

5. Install `pkg-config`.

        sudo apt-get -y install pkg-config

6. Install Protocol Buffers.

        sudo apt-get -y install protobuf-compiler
        sudo apt-get -y install libprotobuf-dev

7. Install Secure Socket Layer (SSL) toolkit development files.

        sudo apt-get -y install libssl-dev

8. Install `wget` to be able to download Boost in the next step.

        sudo apt-get install wget

8. Compile Boost.

    Starting in `rippled` 0.90, the compatible Boost version is 1.65.0. Because Boost version 1.65.0 isn't available in the Ubuntu 16.04 repos, you'll need to compile it yourself. ***TODO: Per Scott D, the recommendation will be either 1.65.0 or 1.66.0+ for 0.90.0. Per Scott D, test with 1.65.0 first; this doc reflects that test. If this PR is accepted, the recommendation will be 1.66.0+***

      a. Download Boost 1.65.0.

          wget https://dl.bintray.com/boostorg/release/1.65.0/source/boost_1_65_0.tar.gz

      b. Untar `boost_1_65_0.tar.gz`.

          tar xvzf boost_1_65_0.tar.gz

      c. In the new `boost_1_65_0` directory, run:

          ./bootstrap.sh

      d. Then run the following command. Replace `<number of jobs>` with the number of CPUs. This may take about 20 minutes, depending on your hardware specs.

          ./b2 -j<number of jobs>

      e. Set the environment variable `BOOST_ROOT` to point to the new `boost_1_65_0` directory. It's best to put this environment variable in your `.profile`, or equivalent, file for your shell so it's automatically set when you log in. Add the following line to the file:

          export BOOST_ROOT=/home/ubuntu/boost_1_65_0

9. Get `rippled` source code.

        git clone https://github.com/ripple/rippled.git
        cd rippled
        git checkout master

10. Build `rippled` binary executable from source code. This may take about 30 minutes, depending on your hardware specs.

        scons

    SCons saves the built executable in `rippled/build`.


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
2018-Jan-08 22:26:59 JobQueue:NFO Auto-tuning to 4 validation/transaction/proposal threads.
2018-Jan-08 22:26:59 Amendments:DBG Amendment C6970A8B603D8778783B61C0D445C23D1633CCFAEF0D43E7DBCD1521D34BD7C3 is supported.
2018-Jan-08 22:26:59 Amendments:DBG Amendment 4C97EBA926031A7CF7D7B36FDE3ED66DDA5421192D63DE53FFB46E43B9DC8373 is supported.
...
2018-Jan-08 22:26:59 ValidatorList:DBG Loading configured trusted validator list publisher keys
...
2018-Jan-08 22:26:59 ValidatorList:DBG Loading configured validator keys
...
2018-Jan-08 22:26:59 ValidatorSite:DBG Loading configured validator list sites
...
2018-Jan-08 22:26:59 LedgerConsensus:NFO Entering consensus process, watching, synced=no
...
2018-Jan-08 22:27:01 LedgerConsensus:WRN
{
    "accepted" : true,
    "account_hash" : "183D5235C7C1FB5AE67AD2F6CC3B28F5FB86E8C4F89DB50DD85641A96470534E",
    "close_flags" : 0,
    "close_time" : 568765620,
    "close_time_human" : "2018-Jan-08 22:27:00",
    "close_time_resolution" : 30,
    "closed" : true,
    "hash" : "CD08E1D9574262BC137CD2B2A9020F52D25A6BD78551EB0FCAD08D40C707CD8B",
    "ledger_hash" : "CD08E1D9574262BC137CD2B2A9020F52D25A6BD78551EB0FCAD08D40C707CD8B",
    "ledger_index" : "2",
    "parent_close_time" : 0,
    "parent_hash" : "AB868A6CFEEC779C2FF845C0AF00A642259986AF40C01976A7F842B6918936C7",
    "seqNum" : "2",
    "totalCoins" : "100000000000000000",
    "total_coins" : "100000000000000000",
    "transaction_hash" : "0000000000000000000000000000000000000000000000000000000000000000"
}
...
2018-Jan-08 22:27:06 NetworkOPs:WRN We are not running on the consensus ledger
2018-Jan-08 22:27:06 LedgerConsensus:WRN Need consensus ledger E836108FDF6C651B15D5F5EA3E19F76CE3F7247188E01F6DBBA455F6738E4DED
...
2018-Jan-08 22:35:09 OpenLedger:WRN Offer involves frozen asset
2018-Jan-08 22:35:12 LedgerConsensus:WRN Offer involves frozen asset
```


## Explore Next Steps

* Now that you have a stock `rippled` server running, you may want to consider running it as a validating server. For information about validating servers and why you might want to run one, see the [rippled Setup Tutorial](tutorial-rippled-setup.html).

* For information about communicating with your `rippled` server using the `rippled` API, see the [`rippled` API reference](reference-rippled.html).

* As a development best practice, you may want to build a `rippled` .deb file. For more information, see _Ubuntu Packaging Guide_: [Packaging New Software](http://packaging.ubuntu.com/html/packaging-new-software.html).

* You may also want to install a `systemd` unit. For more information, see [systemd for Upstart Users](https://wiki.ubuntu.com/SystemdForUpstartUsers). If you are compiling `rippled` from source, you may want to take a look at the `rippled` [systemd unit file](https://github.com/ripple/rippled-package-builder/blob/staging/rpm-builder/rippled.service) that is a part of the `rippled-package-builder` and adjust it to fit your needs.
