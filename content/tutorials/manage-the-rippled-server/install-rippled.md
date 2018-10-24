# Install rippled

Production `rippled` instances can [use Ripple's binary executable](#installation-on-centosred-hat-with-yum), available from the Ripple [yum](https://en.wikipedia.org/wiki/Yellowdog_Updater,_Modified) repository.

For development, you can compile `rippled` from source:

- See [Build and Run `rippled` on Ubuntu](build-run-rippled-ubuntu.html) for Ubuntu Linux 16.04 and higher.
- For other platforms, see the [rippled repository](https://github.com/ripple/rippled/tree/develop/Builds) for instructions.


## Minimum System Requirements

A `rippled` server should run comfortably on commodity hardware, to make it inexpensive to participate in the network. At present, we recommend the following mimimum requirements:

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

## Installation on Ubuntu with alien

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


## Installation on macOS with Homebrew

We don't recommend macOS for `rippled` production use at this time. Currently, the [Ubuntu platform](#installation-on-ubuntu-with-alien) has received the highest level of quality assurance and testing. That said, macOS is suitable for many development/test tasks.

https://github.com/ripple/rippled/tree/develop/Builds/macos

This section assumes that you are using macOS X 10.0 or higher. ***TODO: correct?***

1. Install [Xcode](https://developer.apple.com/download/). ***TODO: min and max version? If you try to install Xcode today, you'll need at least macOS 10.13.6.***

Installing homebrew removes the need to install xcode command line tools separately
  homebrew install lists xcode commend line tools as a requirement: https://docs.brew.sh/Installation#requirements. What does this comment mean?

2. Install Homebrew.

        ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"

3. Update Homebrew.

        brew update

4. Use Homebrew to install git, cmake, pkg-config, protobuf, openssl, and ninja.

        brew install git cmake pkg-config protobuf openssl ninja

5. Download [boost](https://dl.bintray.com/boostorg/release/1.67.0/source/boost_1_67_0.tar.bz2):

Installing Boost directly is going to frustrate people - brew can do it in one command
  Which release to choose?
  Have to deal with environment variables
  “rc” files is a vague statement
  Build issues with Boost not finding lib (boost-context) in my case
  I ended up installing Boost with Brew with no issues

6. build boost: ./bootstrap.sh

7. build boost: ./b2 cxxflags=“-std=c++14”

8. create boost_root variable: export BOOST_ROOT=/Users/manojdoshi/rippled/boost_1_67_0

9. Clone the ripple repo: git clone https://github.com/ripple/rippled.git

Cloning github repo is going to require proper github setup
  Should we provide some guidance or references?

10. switch the branch: git checkout develop

11. Create build folder: mkdir my_build

12. cd my_build

13. Build rippled:

14. cmake -G “Unix Makefiles” -DCMAKE_BUILD_TYPE=Debug ../rippled/

15. cmake --build . -- -j 4

16. Run unit tests: ./rippled --unittest

Daniel: Compiling from source (OSX)

Update rippled
  No instructions on github or dev docs on how to do this for OSX, Windows, or other Linux distros

Is this about how to run rippled too? How to do that...and how to tell if what you are running is working correctly?

## Postinstall

It can take several minutes for `rippled` to sync with the rest of the network, during which time it outputs warnings about missing ledgers. After that, you have a fully functional stock `rippled` server that you can use for local signing and API access to the XRP Ledger.

You can use the [rippled commandline interface](get-started-with-the-rippled-api.html#commandline) as follows:

    $ /opt/ripple/bin/rippled <METHOD>

For a full list of available methods, see the [rippled API reference](rippled-api.html).

### Additional Configuration

`rippled` should connect to the XRP Ledger with the default configuration. However, you can change your settings by editing the `rippled.cfg` file (located at `/opt/ripple/etc/rippled.cfg` when installing `rippled` with yum). For recommendations about configuration settings, see [Capacity Planning](capacity-planning.html).

See [the `rippled` GitHub repository](https://github.com/ripple/rippled/blob/master/cfg/rippled-example.cfg) for a description of all configuration options.

Changes to the `[debug_logfile]` or `[database_path]` sections may require you to give the `rippled` user and group ownership to your new configured path:

        $ chown -R rippled:rippled <configured path>

Restart `rippled` for any configuration changes to take effect:

        $ sudo service rippled restart
