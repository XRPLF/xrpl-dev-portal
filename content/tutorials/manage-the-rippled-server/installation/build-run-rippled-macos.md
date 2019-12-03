# Build and Run rippled on macOS

The macOS platform is not recommended for [`rippled`](the-rippled-server.html) production use. For production, consider using the [Ubuntu platform](install-rippled-on-ubuntu-with-alien.html), which has received the highest level of quality assurance and testing.

That said, macOS is suitable for many development and testing tasks. `rippled` has been tested for use with macOS up to 10.13 High Sierra.

For development purposes, run `rippled` as a non-admin user, not using `sudo`.

1. Install [Xcode](https://developer.apple.com/download/).

0. Install Xcode command line tools.

        $ xcode-select --install

0. Install [Homebrew](https://brew.sh/).

        $ ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"

0. Update Homebrew.

        $ brew update

0. Use Homebrew to install dependencies.

        $ brew install git cmake pkg-config protobuf openssl ninja

0. Install Boost 1.70.0 or higher. `rippled` 1.4.0 is compatible with Boost 1.70.0 and higher. The latest version of Boost available in the Homebrew repositories isn't new enough, so you must install Boost manually. (The following examples use Boost 1.71.0, which was the newest version at the time of writing.)

      1. Download [Boost 1.71.0](https://dl.bintray.com/boostorg/release/1.71.0/source/boost_1_71_0.tar.bz2).

      2. Extract it to a folder. Be sure to note the location.

      3. In a terminal, run:

            cd /LOCATION/OF/YOUR/BOOST/DIRECTORY
            ./bootstrap.sh
            ./b2 cxxflags="-std=c++14"

0. Ensure that your `BOOST_ROOT` environment points to the directory created by the Boost installation:

      1. To find your Boost directory, use `pwd` if you installed the Boost manually or use `brew --prefix boost` if you installed the Boost with Homebrew.

      2. Edit below code with your Boost directory location and run to add Boost environment variable to your `.bash_profile` file so it's automatically set when you log in.

          $ echo $"export BOOST_ROOT=/Users/my_user/boost_1_71_0" >> ~/.bash_profile

0. If you updated your `.bash_profile` file in the previous step, be sure to source it in a new Terminal window. For example:

        $ source .bash_profile

0. Clone the `rippled` source code into your desired location and access the `rippled` directory. To do this, you'll need to set up Git (installed earlier using Homebrew) and GitHub. For example, you'll need to create a GitHub account and set up your SSH key. For more information, see [Set up git](https://help.github.com/articles/set-up-git/).

        $ git clone git@github.com:ripple/rippled.git
        $ cd rippled

0. By default, cloning puts you on the `develop` branch. Use this branch if you are doing development work and want the latest set of untested features.

      If you want the latest stable release, checkout the `master` branch.

        $ git checkout master

      If you want to test out the latest release candidate, checkout the `release` branch:

        $ git checkout release

      Or, you can checkout one of the tagged releases listed on [GitHub](https://github.com/ripple/rippled/releases).

0. In the `rippled` directory you just cloned, create your build directory and access it. For example:

        $ mkdir my_build
        $ cd my_build

0. Build `rippled`. This could take about 5 minutes, depending on your hardware specs.

        $ cmake -G "Unix Makefiles" -DCMAKE_BUILD_TYPE=Debug ..

      You can set `CMAKE_BUILD_TYPE` to the `Debug` or `Release` build type. All four standard [`CMAKE_BUILD_TYPE`](https://cmake.org/cmake/help/v3.0/variable/CMAKE_BUILD_TYPE.html) values are supported.

0. Run the build using CMake. This could take about 10 minutes, depending on your hardware specs.

        $ cmake --build . -- -j 4

      **Tip:** This example uses a `-j` parameter set to `4`, which uses four processes to build in parallel. The best number of processes to use depends on how many CPU cores your hardware has available. Use `sysctl -n hw.ncpu` to get your CPU core count.

0. Run unit tests built into the server executable. This could take about 5 minutes, depending on your hardware specs. (optional, but recommended)

        $ ./rippled --unittest

0. `rippled` requires the `rippled.cfg` config file to run. You can find an example config file, `rippled-example.cfg` in `rippled/cfg`. Make a copy and save it as `rippled.cfg` in a location that enables you to run `rippled` as a non-root user. Access the `rippled` directory and run:

        $ mkdir -p $HOME/.config/ripple
        $ cp cfg/rippled-example.cfg $HOME/.config/ripple/rippled.cfg

0. Edit `rippled.cfg` to set necessary file paths. The user you plan to run `rippled` as must have write permissions to all of the paths you specify here.

      * Set the `[node_db]` path to the location where you want to store the ledger database.

      * Set the `[database_path]` to the location where you want to store other database data. (This includes an SQLite database with configuration data, and is typically one level above the `[node_db]` path field.)

      * Set the `[debug_logfile]` to a path where `rippled` can write logging information.

      These are the only configurations required for `rippled` to start up successfully. All other configuration is optional and can be tweaked after you have a working server. For more information, see [Additional Configurations](#additional-configuration).

0. `rippled` requires the `validators.txt` file to run. You can find an example validators file, `validators-example.txt`, in `rippled/cfg/`. Make a copy and save it as `validators.txt` in the same folder as your `rippled.cfg` file. Access the `rippled` directory and run:

        $ cp cfg/validators-example.txt $HOME/.config/ripple/validators.txt

      **Warning:** Ripple has designed a decentralization plan with maximum safety in mind. During the transition, you should not modify the `validators.txt` file except as recommended by Ripple. Even minor modifications to your validator settings could cause your server to diverge from the rest of the network and report out of date, incomplete, or inaccurate data. Acting on such data can cause you to lose money.

0. Access your build directory, `my_build` for example, and start the `rippled` service.

        $ ./rippled

      Here's an excerpt of what you can expect to see in your terminal:

```
      2018-Oct-26 18:21:39.593738 JobQueue:NFO Auto-tuning to 6 validation/transaction/proposal threads.
      2018-Oct-26 18:21:39.599634 Amendments:DBG Amendment 4C97EBA926031A7CF7D7B36FDE3ED66DDA5421192D63DE53FFB46E43B9DC8373 is supported.
      2018-Oct-26 18:21:39.599874 Amendments:DBG Amendment 6781F8368C4771B83E8B821D88F580202BCB4228075297B19E4FDC5233F1EFDC is supported.
      2018-Oct-26 18:21:39.599965 Amendments:DBG Amendment 42426C4D4F1009EE67080A9B7965B44656D7714D104A72F9B4369F97ABF044EE is supported.
      2018-Oct-26 18:21:39.600024 Amendments:DBG Amendment 08DE7D96082187F6E6578530258C77FAABABE4C20474BDB82F04B021F1A68647 is supported.
      ...
      2018-Oct-26 18:21:39.603201 OrderBookDB:DBG Advancing from 0 to 3
      2018-Oct-26 18:21:39.603291 OrderBookDB:DBG OrderBookDB::update>
      2018-Oct-26 18:21:39.603480 OrderBookDB:DBG OrderBookDB::update< 0 books found
      2018-Oct-26 18:21:39.649617 ValidatorList:DBG Loading configured trusted validator list publisher keys
      2018-Oct-26 18:21:39.649709 ValidatorList:DBG Loaded 0 keys
      2018-Oct-26 18:21:39.649798 ValidatorList:DBG Loading configured validator keys
      2018-Oct-26 18:21:39.650213 ValidatorList:DBG Loaded 5 entries
      2018-Oct-26 18:21:39.650266 ValidatorSite:DBG Loading configured validator list sites
      2018-Oct-26 18:21:39.650319 ValidatorSite:DBG Loaded 0 sites
      2018-Oct-26 18:21:39.650829 NodeObject:DBG NodeStore.main target size set to 131072
      2018-Oct-26 18:21:39.650876 NodeObject:DBG NodeStore.main target age set to 120000000000
      2018-Oct-26 18:21:39.650931 TaggedCache:DBG LedgerCache target size set to 256
      2018-Oct-26 18:21:39.650981 TaggedCache:DBG LedgerCache target age set to 180000000000
      2018-Oct-26 18:21:39.654252 TaggedCache:DBG TreeNodeCache target size set to 512000
      2018-Oct-26 18:21:39.654336 TaggedCache:DBG TreeNodeCache target age set to 90000000000
      2018-Oct-26 18:21:39.674131 NetworkOPs:NFO Consensus time for #3 with LCL AF8D8984A226AE7099D8A9749B09CE1D84360D5AF9FB86CE2F37500FE1009F9D
      2018-Oct-26 18:21:39.674271 ValidatorList:DBG 5  of 5 listed validators eligible for inclusion in the trusted set
      2018-Oct-26 18:21:39.674334 ValidatorList:DBG Using quorum of 4 for new set of 5 trusted validators (5 added, 0 removed)
      2018-Oct-26 18:21:39.674400 LedgerConsensus:NFO Entering consensus process, watching, synced=no
      2018-Oct-26 18:21:39.674475 LedgerConsensus:NFO Consensus mode change before=observing, after=observing
      2018-Oct-26 18:21:39.674539 NetworkOPs:DBG Initiating consensus engine
      2018-Oct-26 18:21:39.751225 Server:NFO Opened 'port_rpc_admin_local' (ip=127.0.0.1:5005, admin IPs:127.0.0.1, http)
      2018-Oct-26 18:21:39.751515 Server:NFO Opened 'port_peer' (ip=0.0.0.0:51235, peer)
      2018-Oct-26 18:21:39.751689 Server:NFO Opened 'port_ws_admin_local' (ip=127.0.0.1:6006, admin IPs:127.0.0.1, ws)
      2018-Oct-26 18:21:39.751915 Application:FTL Startup RPC:
      {
      	"command" : "log_level",
      	"severity" : "warning"
      }
      2018-Oct-26 18:21:39.752079 Application:FTL Result: {}
      2018-Oct-26 18:22:33.013409 NetworkOPs:WRN We are not running on the consensus ledger
      2018-Oct-26 18:22:33.013875 LedgerConsensus:WRN Need consensus ledger 81804C95ADE119CC874572BAF24DB0C0D240AC58168597951B0CB64C4DA2C628
      2018-Oct-26 18:22:33.883648 LedgerConsensus:WRN View of consensus changed during open status=open,  mode=wrongLedger
      2018-Oct-26 18:22:33.883815 LedgerConsensus:WRN 81804C95ADE119CC874572BAF24DB0C0D240AC58168597951B0CB64C4DA2C628 to 9250C6C8326A48C339E6F99167F4E6BFD0DB00C35518027724D7B376340D21A1
      2018-Oct-26 18:22:33.884068 LedgerConsensus:WRN {"accepted":true,"account_hash":"BBA0E7273005D42E5548DD6456E5AD1F7C89B6EDCB01881E1EECD393E8545947","close_flags":0,"close_time":593893350,"close_time_human":"2018-Oct-26 18:22:30.000000","close_time_resolution":30,"closed":true,"hash":"9250C6C8326A48C339E6F99167F4E6BFD0DB00C35518027724D7B376340D21A1","ledger_hash":"9250C6C8326A48C339E6F99167F4E6BFD0DB00C35518027724D7B376340D21A1","ledger_index":"3","parent_close_time":593893290,"parent_hash":"AF8D8984A226AE7099D8A9749B09CE1D84360D5AF9FB86CE2F37500FE1009F9D","seqNum":"3","totalCoins":"100000000000000000","total_coins":"100000000000000000","transaction_hash":"0000000000000000000000000000000000000000000000000000000000000000"}
      2018-Oct-26 18:23:03.034119 InboundLedger:WRN Want: D901E53926E68EFDA33172DDAC74E8C767D280B68EE68E3010AB0E3179D07B1C
      2018-Oct-26 18:23:03.034334 InboundLedger:WRN Want: 1C01EE79083DE5CE76F3634519D6364C589C4D48631CB9CD10FC2408F87684E2
      2018-Oct-26 18:23:03.034560 InboundLedger:WRN Want: 8CFE3912001BDC5B2C4B2691F3C7811B9F3F193E835D293459D80FBF1C4E684E
      2018-Oct-26 18:23:03.034750 InboundLedger:WRN Want: 8DFAD21AD3090DE5D6F7592B3821C3DA77A72287705B4CF98DC0F84D5DD2BDF8
```

For information about `rippled` log messages, see [Understanding Log Messages](understanding-log-messages.html).

## Next Steps

{% include '_snippets/post-rippled-install.md' %}<!--_ -->

## See Also

- **Concepts:**
    - [The `rippled` Server](the-rippled-server.html)
    - [Introduction to Consensus](intro-to-consensus.html)
- **Tutorials:**
    - [Install rippled on Ubuntu Linux](install-rippled-on-ubuntu.html) - Install a pre-built binary on Ubuntu for production use
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
