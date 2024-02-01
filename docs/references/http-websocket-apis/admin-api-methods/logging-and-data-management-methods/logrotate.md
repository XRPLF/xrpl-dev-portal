---
html: logrotate.html
parent: logging-and-data-management-methods.html
seo:
    description: Reopen the log file.
labels:
  - Data Retention
---
# logrotate
[[Source]](https://github.com/XRPLF/rippled/blob/743bd6c9175c472814448ea889413be79dfd1c07/src/ripple/rpc/handlers/LogRotate.cpp "Source")

The `logrotate` command closes and reopens the log file. This is intended to help with log rotation on Linux file systems.

Most Linux systems come pre-installed with a [`logrotate`](https://linux.die.net/man/8/logrotate) program, which is separate from this command. Application specific log rotation scripts are placed in `/etc/logrotate.d`

The following script is a sample that can be created as `/etc/logrotate.d/rippled`

```logrotate
/var/log/rippled/*.log {
  daily
  minsize 200M
  rotate 7
  nocreate
  missingok
  notifempty
  compress
  compresscmd /usr/bin/nice
  compressoptions -n19 ionice -c3 gzip
  compressext .gz
  postrotate
    /opt/ripple/bin/rippled --conf /opt/ripple/etc/rippled.cfg logrotate
  endscript
}
```

You can configure parameters such as `minsize` and `rotate` depending on the amount of logs you keep. Use the `log_level` setting in your `rippled.cfg` file to configure how verbose your server's logs are. This sample script is based on standard `log_level` and stores approximately 2 weeks worth of logs in a compressed format.

The official packages [for CentOS/Red Hat](../../../../infrastructure/installation/install-rippled-on-centos-rhel-with-yum.md) and [Ubuntu or Debian](../../../../infrastructure/installation/install-rippled-on-ubuntu.md) provide the script `/etc/logrotate.d/rippled` by default. You can make modifications to this as required. Your modifications will not be overwritten on package upgrades. <!-- STYLE_OVERRIDE: will -->

**Note:** You should have only one system log rotation script per application. Please ensure that you do not have any other log rotation that handles the same directory.

_The `logrotate` method is an [admin method](../index.md) that cannot be run by unprivileged users._

### Request Format
An example of the request format:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
    "id": "lr1",
    "command": "logrotate"
}
```
{% /tab %}

{% tab label="Commandline" %}
```sh
#Syntax: logrotate
rippled logrotate
```
{% /tab %}

{% /tabs %}

The request includes no parameters.

### Response Format

An example of a successful response:

{% tabs %}

{% tab label="JSON-RPC" %}
```json
200 OK

{
   "result" : {
      "message" : "The log file was closed and reopened.",
      "status" : "success"
   }
}

```
{% /tab %}

{% tab label="Commandline" %}
```json
Loading: "/etc/rippled.cfg"
Connecting to 127.0.0.1:5005

{
   "result" : {
      "message" : "The log file was closed and reopened.",
      "status" : "success"
   }
}

```
{% /tab %}

{% /tabs %}

The response follows the [standard format][], with a successful result containing the following fields:

| `Field`   | Type   | Description                                             |
|:----------|:-------|:--------------------------------------------------------|
| `message` | String | On success, contains the message `The log file was closed and reopened.` |

### Possible Errors

* Any of the [universal error types][].

{% raw-partial file="/docs/_snippets/common-links.md" /%}
