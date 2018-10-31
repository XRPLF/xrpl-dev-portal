# Install rippled

For production, you can install a `rippled` instance using Ripple's binary executable for [Ubuntu](#installation-on-ubuntu-with-alien) or [CentOS/Red Hat](#installation-on-centosred-hat-with-yum).

For development, you can install a `rippled` instance using Ripple's binary executable for [macOS](#installation-on-macos), or you can build and run `rippled` from source for [Ubuntu](build-run-rippled-ubuntu.html).

For installation information for other platforms, see the [rippled repository](https://github.com/ripple/rippled/tree/develop/Builds).


## Minimum System Requirements

A `rippled` server should run comfortably on commodity hardware, to make it inexpensive to participate in the network. At present, we recommend the following minimum requirements:

- Operating System:
    - Production: CentOS or RedHat Enterprise Linux (latest release) or Ubuntu (16.04+) supported
    - Development: Mac OS X, Windows (64-bit), or most Linux distributions
- CPU: 64-bit x86_64, 2+ cores
- Disk: Minimum 50GB SSD recommended (1000 IOPS, more is better) for the database partition
- RAM:
    - Testing: 8GB+
    - Production: 32 GB

Amazon EC2's `m3.large` VM size may be appropriate depending on your workload. A fast network connection is preferable. Any increase in a server's client-handling load increases resources needs.

**Tip:** For recommendations beyond the minimum requirements, see [Capacity Planning](capacity-planning.html).


## Installation on Ubuntu with alien

<!--{# ***TODO: this doc states that ubuntu has received the highest level of QA and testing - so I moved it above centos and macOS install sections. Okay?*** #}-->

This section assumes that you are using Ubuntu 15.04 or later.

1. Install yum-utils and alien:

        $ sudo apt-get update
        $ sudo apt-get install yum-utils alien

2. Install the Ripple RPM repository:

        $ sudo rpm -Uvh https://mirrors.ripple.com/ripple-repo-el7.rpm

3. Download the `rippled` software package:

        $ yumdownloader --enablerepo=ripple-stable --releasever=el7 rippled

4. Verify the signature on the `rippled` software package:

        $ sudo rpm --import https://mirrors.ripple.com/rpm/RPM-GPG-KEY-ripple-release && rpm -K rippled*.rpm

5. Install the `rippled` software package:

        $ sudo alien -i --scripts rippled*.rpm && rm rippled*.rpm

6. Configure the `rippled` service to start on system boot:

        $ sudo systemctl enable rippled.service

7. Start the `rippled` service

        $ sudo systemctl start rippled.service

For next steps, see [Postinstall](#postinstall) and [Additional Configuration](#additional-configuration).


## Installation on CentOS/Red Hat with yum

This section assumes that you are using CentOS 7 or Red Hat Enterprise Linux 7.

1. Install the Ripple RPM repository:

        $ sudo rpm -Uvh https://mirrors.ripple.com/ripple-repo-el7.rpm

2. Install the `rippled` software package:

        $ sudo yum install --enablerepo=ripple-stable rippled

3. Configure the `rippled` service to start on system boot:

        $ sudo systemctl enable rippled.service

4. Start the `rippled` service

        $ sudo systemctl start rippled.service

For next steps, see [Postinstall](#postinstall) and [Additional Configuration](#additional-configuration).


## Installation on macOS

At this time, we don't recommend using the macOS platform for `rippled` production use. For production, consider using the [Ubuntu platform](#installation-on-ubuntu-with-alien), which has received the highest level of quality assurance and testing.

That said, macOS is suitable for many development and testing tasks.

This section assumes that you are using macOS X 10.0 or higher. ***TODO: okay?***

{% set n = cycler(* range(1,99)) %}

{{n.next()}}. Install [Xcode](https://developer.apple.com/download/).

{{n.next()}}. Install Xcode command line tools.

        xcode-select --install

{{n.next()}}. Install [Homebrew](https://brew.sh/).

        ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"

{{n.next()}}. Update Homebrew.

        brew update

{{n.next()}}. Use Homebrew to install dependencies.

        brew install git cmake pkg-config protobuf openssl ninja

{{n.next()}}. Install a supported version of Boost. Supported versions include Boost 1.67.x - 1.68.x. ***TODO: correctly stated supported versions? Doc will need to keep an eye on these supported versions. In the rippled repo, we say "Boost 1.67 or later is required." <-- Based on our discussion in this doc, I don't think this is true.*** Installation using Homebrew is faster and requires fewer manual steps, but you must ensure that Homebrew installs a supported version of Boost.

    Pick one of the following options to install Boost:

    * To ensure that Homebrew installs a supported version of Boost, use `brew install boost@1.67` to install Boost 1.67.0. ***TODO: When the supported versions change above, we can also change this, if needed. There is no brew command to install 1.68 right now. brew install boost is still installing 1.67 and there is no brew formula boost@1.68.***

    * To use Homebrew to install a different supported version of Boost, check [Homebrew Formulae - boost](https://formulae.brew.sh/formula/boost) to see if there is a formula for the version you want to install. To verify the Boost version a Homebrew formula will install, use `brew info <formula>`. For example, `brew info boost` or `brew info boost@1.67`.

    * To install a supported version of Boost that does not have a defined Homebrew formula, compile Boost yourself. These compile instructions are for Boost 1.68.0.

        1. Download [Boost 1.68.0](https://dl.bintray.com/boostorg/release/1.68.0/source/boost_1_68_0.tar.bz2). ***TODO: do we want to give them CLI instructions? If yes, then we need to have them use brew install wget.***

        2. Extract it to a folder. Be sure to note the location. ***TODO: provide CLI instructions?***

        3. In a terminal, run:

              `./bootstrap.sh`

              `./b2 cxxflags="-std=c++14"`

{{n.next()}}. Ensure that the `BOOST_ROOT` environment variable points to the directory created by your Boost installation. Put this environment variable in your `.bash_profile` so it's automatically set when you log in. For example, ensure that the following line is in the file. To find your Boost install directory, use `brew info boost`. ***TODO: JHA clean out boost env vars and uninstall boost - then try again and see what gets populated in bash_profile....***

        export BOOST_ROOT=/usr/local/Cellar/boost/1.67.0_1

{{n.next()}}. If you updated your `.bash_profile` file in the previous step, be sure to source the file. For example:

        source .bash_profile

{{n.next()}}. Clone the `rippled` source code into your desired location and access the `rippled` directory. To do this, you'll need to set up Git (installed earlier using Homebrew) and GitHub. For example, you'll need to create a GitHub account and set up your SSH key. For more information, see [Set up git](https://help.github.com/articles/set-up-git/).

        git clone git@github.com:ripple/rippled.git
        cd rippled

{{n.next()}}. By default, cloning puts you on the `develop` branch. Use this branch if you are doing development work and want the latest set of untested features.

      If you want the latest stable release, checkout the `master` branch.

        git checkout master

      Or, you can checkout one of the tagged releases listed on [GitHub](https://github.com/ripple/rippled/releases).

      If you want to test out the latest release candidate, checkout the `release` branch:

        git checkout release

{{n.next()}}. Create your `rippled` build directory and access it. For example:

        mkdir my_build
        cd my_build

{{n.next()}}. Build `rippled`. This could take about 5 minutes, depending on your hardware specs.

        cmake -G "Unix Makefiles" -DCMAKE_BUILD_TYPE=Debug ..

      You can set `CMAKE_BUILD_TYPE` to the `Debug` or `Release` build type. All four standard [`CMAKE_BUILD_TYPE`](https://cmake.org/cmake/help/v3.0/variable/CMAKE_BUILD_TYPE.html) values are supported.

{{n.next()}}. Run the build using CMake. This could take about 10 minutes, depending on your hardware specs.

        cmake --build . -- -j 4

      This example uses a `-j` parameter set to `4`, which uses four processes to build in parallel. The best number of processes to use depends on how many CPU cores your hardware has available. Use `sysctl -a | grep machdep.cpu | grep core_count` to get your CPU core count. ***TODO: the mac build page in the github repo (https://github.com/ripple/rippled/tree/develop/Builds/macos#generate-and-build) goes much more in-depth about cmake build options - should we include these here, just to bring a parity between what we say in the rippled repo and what we say here? That said -- do we want to eventually just have one doc on how to do the mac install -- meaning the macos doc content in the rippled repo would go away and just link to this article in the Dev Portal? We also probably want to take a look at what to do with the Linux and Visual Studio install in the rippled repo.***

{{n.next()}}. Run unit tests built into the server executable. This could take about 5 minutes, depending on your hardware specs. (optional, but recommended) <!--{# ***TODO: We should provide info about what to do if you get failures. What should the user do? PM looking into this.*** #}-->

        ./rippled --unittest

{{n.next()}}. Create a copy of the example config file and save it to a location that enables you to run `rippled` as a non-root user (recommended).

        mkdir -p ~/.config/ripple
        cd rippled
        cp cfg/rippled-example.cfg ~/.config/ripple/rippled.cfg

{{n.next()}}. Edit `rippled.cfg` to set necessary file paths. The user you plan to run `rippled` as must have write permissions to all of the paths you specify here. ***TODO: I think we need to add this step to the centos and ubuntu tasks, correct? For centos and ubuntu, the config files are automatically placed in the correct directories, but the following paths still need to be manually updated to avoid permission issues, correct?***

      * Set the `[node_db]` path to the location where you want to store the ledger database.

      * Set the `[database_path]` to the location where you want to store other database data. (This includes an SQLite database with configuration data, and is typically one level above the `[node_db]` path field.)

      * Set the `[debug_logfile]` to a path where `rippled` can write logging information.

      These are the only configurations required for `rippled` to start up successfully. All other configuration is optional and can be tweaked after you have a working server. For more information, see [Additional Configurations](#additional-configuration).

{{n.next()}}. Copy the example `validators.txt` file to the same folder as `rippled.cfg`:

        cp cfg/validators-example.txt ~/.config/ripple/validators.txt

      **Warning:** Ripple has designed a decentralization plan with maximum safety in mind. During the transition, you should not modify the `validators.txt` file except as recommended by Ripple. Even minor modifications to your validator settings could cause your server to diverge from the rest of the network and report out of date, incomplete, or inaccurate data. Acting on such data can cause you to lose money.

{{n.next()}}. Start the `rippled` service.

        sudo ./rippled

For next steps, see [Postinstall](#postinstall) and [Additional Configuration](#additional-configuration).


## Postinstall

It can take several minutes for `rippled` to sync with the rest of the network, during which time it outputs warnings about missing ledgers.

Here's an excerpt of what you can expect to see in your terminal: ***TODO: you'll see this in the CLI for the macOS install, but not for centos and ubuntu using the instructions provided in this doc. For centos and ubuntu - is there a benefit to giving the user a command that will display this view? Does such a command exist? If not, for centos and ubuntu - we need to give the user some other way to tell that the service is running correctly - refer them to server states?***

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

<!--{# ***TODO: for the future, provide a reference for what the most common and unintuitive messages mean -- esp when signaling possible errors.*** #}-->

Once your `rippled` has synchronized with the rest of the network, you have a fully functional stock `rippled` server that you can use for local signing and API access to the XRP Ledger. Use [`rippled` server states](rippled-server-states.html) to tell whether your `rippled` server has synchronized with the network.

For information about communicating with your `rippled` server using the rippled API, see the [rippled API reference](rippled-api.html).

Once you have your stock `rippled` server running, you may want to consider running it as a validating server. For information about validating servers and why you might want to run one, see [Run rippled as a Validator](run-rippled-as-a-validator.html).


## Additional Configuration

`rippled` should connect to the XRP Ledger with the default configurations. However, you can change your settings by editing the `rippled.cfg` file. For recommendations about configuration settings, see [Capacity Planning](capacity-planning.html).

The default locations for `rippled.cfg` are as follows:

* CentOS/Red Hat with yum: `/opt/ripple/etc/`

* Ubuntu with alien: `~/.config/ripple/`

* macOS: `~/.config/ripple/`

Changes to the `[debug_logfile]` or `[database_path]` sections may require you to give the `rippled` user and group ownership to your new configured path: ***TODO: [node_db] as well? When I try this for a [node_db] value of /var/lib/rippled/db/rocksdb: chown -R rippled:rippled /var/lib/rippled/db/rocksdb, I get -- chown: rippled: illegal group name. Is rippled:rippled just an example below? Or should there be a rippled group?***

    $ chown -R rippled:rippled <configured path>

Restart `rippled` for any configuration changes to take effect: ***TODO: does this command work for centos, ubuntu, and macOS? JHA verify.***

    $ sudo service rippled restart
