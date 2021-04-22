---
html: health-check-interventions.html
parent: troubleshoot-the-rippled-server.html
blurb: Use the rippled server's health check as part of automated infrastructure monitoring.
---
# Health Check Interventions

The [Health Check method](health-check.html) can be used by automated monitoring to recognize when a `rippled` server is not healthy and prompt interventions such as restarting the server or alerting a human administrator.

Infrastructure monitoring, and reliability engineering more generally, is an advanced discipline that involves using multiple sources of data to make decisions in context. This document provides some suggestions for how to use the health check most effectively, but these recommendations are only meant as guidelines as part of a larger strategy.

## Momentary Failures

Some [metrics][] in the health check can rapidly fluctuate into unhealthy ranges and then recover automatically shortly afterward. It is unnecessary and undesirable to raise alerts every single time the health check reports an unhealthy status. An automated monitoring system should call the health check method frequently, but only escalate to a higher level of intervention based on the severity and frequency of the problem.

For example, if you check the health of the server once per second, you might raise an alert if the server reports "warning" status three times in a row, or four times in a five-second span. You might also raise an alert if the server reports "critical" status twice in a five-second span.

**Tip:** The server normally reports a "critical" status for the first few seconds after startup, switches to a "warning" status after it establishes a connection to the network, and finally reports a "healthy" status when it has fully synced to the network. After a restart, you should give a server 5–15 minutes to sync before taking additional interventions.

## Special Cases

Certain server configurations may always report a `warning` status even when operating normally. If your server qualifies as a special case, you must configure your automated monitoring to recognize the difference between the normal status and an actual problem. This probably involves parsing the JSON response body for the health check method and comparing the values there with expected normal ranges.

Some examples of special cases that may occur include:

- A [private peer](peer-protocol.html#private-peers) typically has a very small number of peer-to-peer connections to known servers only, but the health check reports a warning on the `peers` metric if the server is connected to 7 or fewer peers. You should know the exact number of peers your server is configured to have and check for that value.
- On a [parallel or test network](parallel-networks.html) where new transactions are not being sent continuously, the network waits up to 20 seconds for new transactions before attempting to validate a new ledger version, but the health check reports a warning on the `validated_ledger` metric if the latest validated ledger is 7 or more seconds old. If you are running `rippled` on a non-production network, you may want to ignore `warning` messages for this metric unless you know that there should be transactions being regularly sent. You may still want to alert on the `critical` level of 20 seconds, because the XRP Ledger protocol is designed to validate new ledger versions at least once every 20 seconds even if there are no new transactions to process.

## Suggested Interventions

When a health check fails, and it's not just a [momentary failure](#momentary-failures), the action to take to recover from the outage varies based on the cause. You may be able to configure your infrastructure to fix some types of failures automatically. Other failures require the intervention of a human administrator who can investigate and take the necessary steps to resolve more complex or critical failures; depending on the structure of your organization, you may have different levels of human administrator so that less skilled, lower level administrators can fix certain issues independently, but need to escalate to higher level administrators to fix larger or more complex issues. How and when you respond is likely to depend on your unique situation, but the metrics reported in the health check result can be a factor in these decisions.

The following sections suggest some common interventions you may want to attempt and the health check statuses most likely to prompt those interventions. Automated systems and human administrators may selectively escalate through these and other interventions:

- [Redirect traffic](#redirect-traffic) away from the affected server
- [Restart](#restart) the server software or hardware
- [Upgrade](#upgrade) the `rippled` software
- [Investigate network](#investigate-network) in case the problem originates elsewhere
- [Replace hardware](#replace-hardware)


### Redirect Traffic

A common reliability technique is to run a pool of redundant servers through one or more load-balancing proxies. You can do this with `rippled` servers, but should not do this with [validators](rippled-server-modes.html). In some cases, the load balancers can monitor the health of servers in their pools and direct traffic only to the servers that are currently reporting themselves as healthy. This allows servers to recover from being temporarily overloaded and automatically rejoin the pool of active servers.

Redirecting traffic away from a server that is unhealthy is an appropriate response, especially for servers that report a `health` status of `warning`. Servers in the `critical` range may need more significant interventions.


### Restart

The most straightforward intervention is to restart the server. This can resolve temporary issues with several types of failures, including any of the following [metrics][]:

- `load_factor`
- `peers`
- `server_state`
- `validated_ledger`

To restart only the `rippled` service, use `systemctl`:

```
$ sudo systemctl restart rippled.service
```

A stronger intervention is to restart the entire machine.

**Caution:** After a server starts, it typically needs up to 15 minutes to sync to the network. During this time, the health check is likely to report a critical or warning status. You should be sure your automated systems give servers enough time to sync before restarting them again.


### Upgrade

If the server reports `"amendment_blocked": true` in the health check, this indicates that the XRP Ledger has enabled a [protocol amendment](amendments.html) that your server does not understand. As a precaution against misinterpreting the revised rules of the network in a way that causes you to lose money, such servers become "amendment blocked" instead of operating normally.

To resolve being amendment blocked, [update your server](install-rippled.html) to a newer software version that understands the amendment.

Also, software bugs can cause a server to get [stuck not syncing](server-doesnt-sync.html). In this case, the `server_state` metric is likely to be in a warning or critical state. If you are not using the latest stable release, you should upgrade to get the latest fixes for any known issues that could cause this.


### Investigate Network

An unreliable or insufficient network connection can cause a server to report outages. Warning or critical values in the following [metrics][] can indicate network problems:

- `peers`
- `server_state`
- `validated_ledger`

In this case, the necessary interventions may involve changes to other systems, such as:

- Adjusting firewall rules to allow necessary traffic to reach a server, or to block harmful traffic from outside
- Restarting or replacing network interfaces, switches, routers, or cabling
- Contacting other network service providers to resolve an issue on their end



### Replace Hardware

If the outage is caused by a hardware failure or by higher load than the hardware is capable of handling, you may need to replace some components or even the entire server.

The amount of load on a server in the XRP Ledger depends in part on transaction volume in the network, which varies organically. Load also depends on your usage pattern. See [Capacity Planning](capacity-planning.html) for how to plan the appropriate hardware and settings for your situation.

Warning or critical values for the following [metrics][] may indicate insufficient hardware:

- `load_factor`
- `server_state`
- `validated_ledger`






<!--{# common link defs #}-->
[metrics]: health-check.html#response-format
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
