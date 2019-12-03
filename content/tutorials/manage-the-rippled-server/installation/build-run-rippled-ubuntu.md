# Build and Run rippled on Ubuntu

`rippled` is the core peer-to-peer server that manages the XRP Ledger. A `rippled` server can connect to a network of peers, relay cryptographically signed transactions, and maintain a local copy of the complete shared global ledger.

For an overview of `rippled`, see [Operating rippled Servers](install-rippled.html).

Use these instructions to build a `rippled` executable from source version 1.2.0 or higher on Ubuntu Linux 16.04 or higher. These instructions were tested on Ubuntu 16.04 LTS.

For information about building `rippled` for other platforms, see [Builds](https://github.com/ripple/rippled/tree/develop/Builds) in the `rippled` GitHub repository.


## Prerequisites

Before you compile or install `rippled`, you must meet the [System Requirements](system-requirements.html).

## 1. Build `rippled`

These instructions use Ubuntu's APT (Advanced Packaging Tool) to install the software prerequisites you need to build and run `rippled`.

1. Update the list of packages that are available for `apt-get` to install or upgrade.

        sudo apt-get update

2. Upgrade currently installed packages.

        sudo apt-get -y upgrade

3. Install dependencies.

        sudo apt-get -y install git pkg-config protobuf-compiler libprotobuf-dev libssl-dev wget

4. Install CMake.

    Version 1.4.0 of `rippled` requires CMake 3.9.0 or higher. For the purposes of this tutorial, we used CMake 3.13.3, which was the latest version available at the time of writing.

    If you have previously installed CMake 3.9.0 or higher, you can skip these steps.

    To install CMake 3.13.3:

        wget https://github.com/Kitware/CMake/releases/download/v3.13.3/cmake-3.13.3-Linux-x86_64.sh
        sudo sh cmake-3.13.3-Linux-x86_64.sh --prefix=/usr/local --exclude-subdir

    Use `cmake --version` to verify that the installation worked.

5. Compile Boost.

    Version 1.4.0 of `rippled` requires Boost version 1.70.0 or higher. Because Boost version 1.70.0 or higher isn't available in the Ubuntu 18.04 (or 16.04) software repositories, you must compile it yourself. The following examples use Boost 1.71.0, which was the newest version at the time of writing.

    If you have previously built Boost 1.71.0 for `rippled` and configured the `BOOST_ROOT` environment variable, you can skip these steps.

      1. Download Boost 1.71.0.

              wget https://dl.bintray.com/boostorg/release/1.71.0/source/boost_1_71_0.tar.gz

      2. Extract `boost_1_71_0.tar.gz`.

              tar xvzf boost_1_71_0.tar.gz

      3. Change to the new `boost_1_71_0` directory.

              cd boost_1_71_0

      4. Prepare the Boost.Build system for use.

              ./bootstrap.sh

      5. Build the separately-compiled Boost libraries. This may take about 10 minutes, depending on your hardware specs.

              ./b2 -j 4

          **Tip:** This example uses 4 processes to build in parallel. The best number of processes to use depends on how many CPU cores your hardware has available. You can use `cat /proc/cpuinfo` to get information about your hardware's processor.

      6. Set the environment variable `BOOST_ROOT` to point to the new `boost_1_71_0` directory. It's best to put this environment variable in your `.profile`, or equivalent, file for your shell so it's automatically set when you log in. Add the following line to the file:

              export BOOST_ROOT=/home/my_user/boost_1_71_0

      7. Source your updated `.profile` file. For example:

              source ~/.profile

6. From a working directory, get the `rippled` source code. The `master` branch has the latest released version.

        git clone https://github.com/ripple/rippled.git
        cd rippled
        git checkout master

7. Check the commit log to be sure you're compiling the version you intend to. The most recent commit should be signed by a well-known Ripple developer and should set the version number to the latest released version. For example:

        $ git log -1

        commit 06c371544acc3b488b9d9c057cee4e51f6bef7a2
        Author: Nik Bougalis <nikb@bougalis.net>
        Date:   Mon Nov 25 22:58:03 2019 -0800

            Set version to 1.4.0




8. If you previously built, or (more importantly) tried and failed to build `rippled`, you should delete the `my_build/` directory (or whatever you named it) to start clean before moving on to the next step. Otherwise, you may get unexpected behavior, like a `rippled` executable that crashes due to a segmentation fault (segfault).

    If this is your first time building `rippled` 1.0.0 or higher, you won't have a `my_build/` directory and can move on to the next step.

9. Use CMake to build a `rippled` binary executable from source code. The result will be a `rippled` binary executable in the `my_build` directory.

      1. Generate the build system. Builds should be performed in a directory that is separate from the source tree root. In this example, we'll use a `my_build` directory that is a subdirectory of `rippled`.

              mkdir my_build
              cd my_build
              cmake ..

          **Tip:** The default build includes debugging symbols, which can be useful for development but are inefficient in production. To build `rippled` for use on production servers, add the `-DCMAKE_BUILD_TYPE=Release` flag when running the `cmake` command.

      2. Build the `rippled` binary executable. This may take about 30 minutes, depending on your hardware specs.

              cmake --build .

10. _(Optional)_ Run `rippled` unit tests. If there are no test failures, you can be fairly certain that your `rippled` executable compiled correctly.

        ./rippled -u


## 2. Configure `rippled`

Complete the following configurations that are required for `rippled` to start up successfully. All other configuration is optional and can be tweaked after you have a working server.

1. Create a copy of the example config file (assumes you're in the `rippled` folder already). Saving the config file to this location enables you to run `rippled` as a non-root user (recommended).

        mkdir -p ~/.config/ripple
        cp cfg/rippled-example.cfg ~/.config/ripple/rippled.cfg

2. Edit the config file to set necessary file paths. The user you plan to run `rippled` as must have write permissions to all of the paths you specify here.

      1. Set the `[node_db]`'s path to the location where you want to store the ledger database.

      2. Set the `[database_path]` to the location where you want to store other database data. (This includes an SQLite database with configuration data, and is typically one level above the `[node_db]` path field.)

      3. Set the `[debug_logfile]` to a path where `rippled` can write logging information.

3. Copy the example `validators.txt` file to the same folder as `rippled.cfg`:

        cp cfg/validators-example.txt ~/.config/ripple/validators.txt

    **Warning:** Ripple has designed a [decentralization plan](https://xrpl.org/blog/2017/decent-strategy-update.html) with maximum safety in mind. During the transition, you *should not* modify the `validators.txt` file except as recommended by Ripple. Even minor modifications to your validator settings could cause your server to diverge from the rest of the network and report out of date, incomplete, or inaccurate data. Acting on such data can cause you to lose money.


## 3. Run `rippled`

To run your stock `rippled` server from the executable you built, using the configurations you defined:
```
cd my_build
./rippled
```


### What to Expect

Once you've run `rippled`, here are excerpts of what you can expect to see in your terminal.

```
Loading: "/home/ubuntu/.config/ripple/rippled.cfg"
Watchdog: Launching child 1
2018-Jun-06 00:51:35.094331139 JobQueue:NFO Auto-tuning to 4 validation/transaction/proposal threads.
2018-Jun-06 00:51:35.100607625 Amendments:DBG Amendment 4C97EBA926031A7CF7D7B36FDE3ED66DDA5421192D63DE53FFB46E43B9DC8373 is supported.
2018-Jun-06 00:51:35.101226904 Amendments:DBG Amendment 6781F8368C4771B83E8B821D88F580202BCB4228075297B19E4FDC5233F1EFDC is supported.
2018-Jun-06 00:51:35.101354503 Amendments:DBG Amendment 42426C4D4F1009EE67080A9B7965B44656D7714D104A72F9B4369F97ABF044EE is supported.
2018-Jun-06 00:51:35.101503304 Amendments:DBG Amendment 08DE7D96082187F6E6578530258C77FAABABE4C20474BDB82F04B021F1A68647 is supported.
2018-Jun-06 00:51:35.101624717 Amendments:DBG Amendment 740352F2412A9909880C23A559FCECEDA3BE2126FED62FC7660D628A06927F11 is supported.
...
2018-Jun-06 00:51:35.106970906 OrderBookDB:DBG Advancing from 0 to 3
2018-Jun-06 00:51:35.107158071 OrderBookDB:DBG OrderBookDB::update>
2018-Jun-06 00:51:35.107380722 OrderBookDB:DBG OrderBookDB::update< 0 books found
2018-Jun-06 00:51:35.168875072 ManifestCache:NFO Manifest: AcceptedNew;Pk: nHBARBMi2MC3LJYuvs9Rhp94WcfbxoQD5BGhwN3jaHBsPkbNpoZq;Seq: 1;
2018-Jun-06 00:51:35.172099325 ManifestCache:NFO Manifest: AcceptedNew;Pk: nHB57Sey9QgaB8CubTPvMZLkLAzfJzNMWBCCiDRgazWJujRdnz13;Seq: 1;
2018-Jun-06 00:51:35.175302816 ManifestCache:NFO Manifest: AcceptedNew;Pk: nHDsPCxoBHZS9KNNfsd7iVaQXBSitNtbqXfB6BS1iEmJwwEKLhhQ;Seq: 1;
2018-Jun-06 00:51:35.178486951 ManifestCache:NFO Manifest: AcceptedNew;Pk: nHBQ3CT3EWYZ4uzbnL3k6TRf9bBPhWRFVcK1F5NjtwCBksMEt5yy;Seq: 2;
2018-Jun-06 00:51:35.181681868 ManifestCache:NFO Manifest: AcceptedNew;Pk: nHU5egMCYs1g7YRVKrKjEqVYFL12mFWwkqVFTiz2Zi4Z8jppPgxU;Seq: 2;
2018-Jun-06 00:51:35.184864291 ManifestCache:NFO Manifest: AcceptedNew;Pk: nHBbiP5ua5dUqCTz5i5vd3ia9jg3KJthohDjgKxnc7LxtmnauW7Z;Seq: 2;
...
2018-Jun-06 00:51:35.317972033 LedgerConsensus:NFO Entering consensus process, watching, synced=no
2018-Jun-06 00:51:35.318155351 LedgerConsensus:NFO Consensus mode change before=observing, after=observing
2018-Jun-06 00:51:35.318360468 NetworkOPs:DBG Initiating consensus engine
2018-Jun-06 00:51:35.358673488 Server:NFO Opened 'port_rpc_admin_local' (ip=127.0.0.1:5005, admin IPs:127.0.0.1, http)
2018-Jun-06 00:51:35.359296222 Server:NFO Opened 'port_peer' (ip=0.0.0.0:51235, peer)
2018-Jun-06 00:51:35.359778994 Server:NFO Opened 'port_ws_admin_local' (ip=127.0.0.1:6006, admin IPs:127.0.0.1, ws)
2018-Jun-06 00:51:35.360240190 Application:FTL Startup RPC:
{
	"command" : "log_level",
	"severity" : "warning"
}
...
2018-Jun-06 00:52:32.385295633 NetworkOPs:WRN We are not running on the consensus ledger
2018-Jun-06 00:52:32.388552023 LedgerConsensus:WRN Need consensus ledger 84726E8C5B346E28C21ADE6AAD703E65F802322EDAA5B76446A4D0C5206AB2DB
2018-Jun-06 00:52:33.379448561 LedgerConsensus:WRN View of consensus changed during open status=open,  mode=wrongLedger
2018-Jun-06 00:52:33.379541915 LedgerConsensus:WRN 84726E8C5B346E28C21ADE6AAD703E65F802322EDAA5B76446A4D0C5206AB2DB to 1720162AE3BA8CD953BFB40EB746D7B78D13E1C97905E8C553E0B573F1B6A517
2018-Jun-06 00:52:33.379747629 LedgerConsensus:WRN {"accepted":true,"account_hash":"CC1F1EC08E76BC9FE843BBF9C6068C5B73192E6957B9CC1174DCB2B94DD2025A","close_flags":0,"close_time":581561550,"close_time_human":"2018-Jun-06 00:52:30.000000000","close_time_resolution":30,"closed":true,"hash":"94354A7FECAB638C29BBC79B18CFDBDC05E4FF72647AD62F072DB4D23A5E0317","ledger_hash":"94354A7FECAB638C29BBC79B18CFDBDC05E4FF72647AD62F072DB4D23A5E0317","ledger_index":"3","parent_close_time":581561490,"parent_hash":"80BF92A69F65F5C543E962DF4B41715546FDD97FC6988028E5ACBB46654756CA","seqNum":"3","totalCoins":"100000000000000000","total_coins":"100000000000000000","transaction_hash":"0000000000000000000000000000000000000000000000000000000000000000"}
...
2018-Jun-06 00:53:50.568965045 LedgerConsensus:WRN {"accepted":true,"account_hash":"A79E6754544F9C8FC74870C95A39CED1D45CC1206DDA4C113E51F9DB6DDB0E76","close_flags":0,"close_time":581561630,"close_time_human":"2018-Jun-06 00:53:50.000000000","close_time_resolution":10,"closed":true,"hash":"6294118F39F5F2B8349E7CC6D4D5931011622E78DD4E34D91372651E9F453E2F","ledger_hash":"6294118F39F5F2B8349E7CC6D4D5931011622E78DD4E34D91372651E9F453E2F","ledger_index":"29","parent_close_time":581561623,"parent_hash":"5F57870CE5160D6B53271955F26E3BE63696D1127B91BC7943F9A199B313CB85","seqNum":"29","totalCoins":"100000000000000000","total_coins":"100000000000000000","transaction_hash":"0000000000000000000000000000000000000000000000000000000000000000"}
2018-Jun-06 00:53:50.569776678 LedgerConsensus:WRN Need consensus ledger 6A0DE66550B6BA9636E3F8FDB71C2E924D182A1835E4143B2170DAA1D33CAE8D
2018-Jun-06 00:53:51.576778862 NetworkOPs:WRN We are not running on the consensus ledger
2018-Jun-06 00:53:53.576524564 LedgerConsensus:WRN View of consensus changed during establish status=establish,  mode=wrongLedger
2018-Jun-06 00:53:53.576783663 LedgerConsensus:WRN 6A0DE66550B6BA9636E3F8FDB71C2E924D182A1835E4143B2170DAA1D33CAE8D to 1CB9C9A1C27403CBAB9DFCFA61E1F915059DFE4FA93524537B885CC190DB5C6B
2018-Jun-06 00:53:53.577079124 LedgerConsensus:WRN {"accepted":true,"account_hash":"5CAB3E4F5F2AC1A764106D7CC0729E6E7D1F7F93C65B7D8CB04C8DE2FC2C1305","close_flags":0,"close_time":581561631,"close_time_human":"2018-Jun-06 00:53:51.000000000","close_time_resolution":10,"closed":true,"hash":"201E147BD195CE3C56B0C0B8DF58386FC7BFF450E1E5B286A29AB856926D5F79","ledger_hash":"201E147BD195CE3C56B0C0B8DF58386FC7BFF450E1E5B286A29AB856926D5F79","ledger_index":"30","parent_close_time":581561630,"parent_hash":"6294118F39F5F2B8349E7CC6D4D5931011622E78DD4E34D91372651E9F453E2F","seqNum":"30","totalCoins":"100000000000000000","total_coins":"100000000000000000","transaction_hash":"0000000000000000000000000000000000000000000000000000000000000000"}
```


## Explore Next Steps

* Now that you have a stock `rippled` server running, you may want to consider running it as a validating server. For information about validating servers and why you might want to run one, see the [rippled Setup Tutorial](install-rippled.html).

* For information about communicating with your `rippled` server using the `rippled` API, see the [`rippled` API reference](rippled-api.html).

* As a development best practice, you may want to build a `rippled` `.deb` package. You can use the CMake build's deb package target to build a `deb` package directly from the source tree. The build machine must have [Docker installed](https://docs.docker.com/install/#supported-platforms). This process may take more than an hour to complete. To build the `deb` package:

        mkdir -p build/pkg && cd build/pkg
        cmake -Dpackages_only=ON ../..
        cmake --build . --target dpkg

* You may also want to install a `systemd` unit. For more information, see [systemd for Upstart Users](https://wiki.ubuntu.com/SystemdForUpstartUsers). You can use the [official `rippled` system unit file](https://github.com/ripple/rippled/blob/master/Builds/containers/shared/rippled.service) or modify it to suit your needs.

## See Also

- **Concepts:**
    - [The `rippled` Server](the-rippled-server.html)
    - [Introduction to Consensus](intro-to-consensus.html)
- **Tutorials:**
    - [Configure rippled](configure-rippled.html)
    - [Troubleshoot rippled](troubleshoot-the-rippled-server.html)
    - [Get Started with the rippled API](get-started-with-the-rippled-api.html)
- **References:**
    - [rippled API Reference](rippled-api.html)
        - [`rippled` Commandline Usage](commandline-usage.html)
        - [server_info method][]


<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
