# rippled v1.3.0 Migration Instructions

The install and upgrade process on supported platforms has changed for `rippled` v1.3.0. If you have `rippled` v1.2.4 or lower installed, follow the instructions for upgrading on your platform:

- [CentOS or Red Hat Enterprise Linux (RHEL)](#migration-on-centos-or-red-hat-enterprise-linux-rhel)
- [Ubuntu Linux](#migration-on-ubuntu-linux)

For other platforms, see the updated instructions for compiling from source.

# Migration on CentOS or Red Hat Enterprise Linux (RHEL)

***TODO: instructions per https://github.com/ripple/ripple-dev-portal/issues/544***

Roughly:

- stop rippled
- backup data & config
- uninstall package w/ `rpm -e` or `yum remove`
- install 1.3 the standard way
- stop rippled
- restore config & data files
- start rippled, check status


# Migration on Ubuntu Linux

***TODO: instructions per https://github.com/ripple/ripple-dev-portal/issues/544***

Roughly:

- stop rippled
- backup data & config
- uninstall package w/ alien
- install 1.3 the standard way (now w/ `apt`)
- stop rippled
- restore config & data files
- start rippled, check status
- optionally remove alien itself
