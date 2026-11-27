---
html: health-check-interventions.html
parent: troubleshoot-the-xrpld-server.html
seo:
    description: Use the xrpld server's health check as part of automated infrastructure monitoring.
labels:
  - Core Server
---
# Health Check Interventions

The [Health Check method](../../references/http-websocket-apis/peer-port-methods/health-check.md) can be used by automated monitoring to recognize when an `xrpld` server isn't healthy and prompt interventions such as restarting the server or alerting a human administrator.

Infrastructure monitoring, and reliability engineering more generally, is an advanced discipline that involves using multiple sources of data to make decisions in context. This document provides some suggestions for how to use the health check most effectively, but these recommendations are only meant as guidelines as part of a larger strategy.

## Momentary Failures

Some [metrics][] in the health check can rapidly fluctuate into unhealthy ranges and then recover automatically shortly afterward. It is unnecessary and undesirable to raise alerts every single time the health check reports an unhealthy status. An automated monitoring system should call the health check method often, but only escalate to a higher level of intervention if the problem is severe and consistent.

For example, if you check the health of the server once per second, you might raise an alert if the server reports "warning" status three times in a row, or four times in a five-second span. You might also raise an alert if the server reports "critical" status twice in a five-second span. It is usually excessive to raise an alert every single time the server reports "warning".

{% admonition type="success" name="Tip" %}The server normally reports a "critical" status for the first few seconds after startup, switches to a "warning" status after it establishes a connection to the network, and finally reports a "healthy" status when it has fully synced to the network. After a restart, you should give a server 5 to 15 minutes to sync before taking additional interventions.{% /admonition %}

## Special Cases

Certain server configurations may always report a `warning` status even when operating normally. The HTTP status code carries the result: 200 for healthy, 503 for warning, and 500 for critical. If your server qualifies as a special case, you must configure your automated monitoring to recognize the difference between the normal status and an actual problem. This probably involves parsing the JSON response body for the health check method and comparing the values there with expected normal ranges.

Some examples of special cases that may occur include:

- A server with no peer port, such as the [outbound-only validator topology](../configuration/security/validator.md#topology-and-exposure), has no health check at all, because the endpoint is served on the peer port. Monitor such a server with `server_info` over an admin connection instead.
- A [private peer](../../concepts/networks-and-servers/peer-protocol.md#private-peers) typically has a very small number of peer-to-peer connections to known servers only, but the health check reports a warning on the `peers` metric if the server is connected to 1 to 7 peers, and critical with none. You should know the exact number of peers your server is configured to have and check for that value.
- The `validated_ledger` metric is meant to warn at 7 seconds and go critical at 20, but in current versions the health check never receives the ledger age, so it reports on this metric only when the server has no validated ledger at all. Monitor ledger age from `server_info` instead; see [Validator Best Practices](../configuration/best-practices/validator.md#know-what-healthy-looks-like).

## Suggested Interventions

When a health check fails, and it's not just a [momentary failure](#momentary-failures), the action to take to recover from the outage varies based on the cause. You may be able to configure your infrastructure to fix some types of failures automatically. Other failures require the intervention of a human administrator who can investigate and take the necessary steps to resolve more complex or critical failures; depending on the structure of your organization, you may have different levels of human administrator so that less skilled, lower level administrators can fix certain issues independently, but need to escalate to higher level administrators to fix larger or more complex issues. How and when you respond is likely to depend on your unique situation, but the metrics reported in the health check result can be a factor in these decisions. <!-- STYLE_OVERRIDE: just -->

The following sections suggest some common interventions you may want to attempt and the health check statuses most likely to prompt those interventions. Automated systems and human administrators may selectively escalate through these and other interventions:

- [Redirect traffic](#redirect-traffic) away from the affected server
- [Restart](#restart) the server software or hardware
- [Upgrade](#upgrade) the `xrpld` software
- [Investigate network](#investigate-network) in case the problem originates elsewhere
- [Replace hardware](#replace-hardware)


### Redirect Traffic

A common reliability technique is to run a pool of redundant servers through one or more load-balancing proxies. You can do this with `xrpld` servers, but shouldn't do this with [validators](../../concepts/networks-and-servers/xrpld-server-modes.md). In some cases, the load balancers can monitor the health of servers in their pools and direct traffic only to the servers that are currently reporting themselves as healthy. This allows servers to recover from being temporarily overloaded and automatically rejoin the pool of active servers.

Redirecting traffic away from a server that is unhealthy is an appropriate response, especially for servers that report a `health` status of `warning`. Servers in the `critical` range may need more significant interventions.


### Restart

The most straightforward intervention is to restart the server. This can resolve temporary issues with several types of failures, including any of the following [metrics][]:

- `load_factor`
- `peers`
- `server_state`
- `validated_ledger`

To restart only the `xrpld` service, use `systemctl`:

```
$ sudo systemctl restart xrpld.service
```

A stronger intervention is to restart the entire machine. On a validator, check first for an online deletion rotation that is still running, and give the server time to stop. See [Restart with care](../configuration/best-practices/validator.md#restart-with-care).

{% admonition type="warning" name="Caution" %}After a server starts, it typically needs up to 15 minutes to sync to the network. During this time, the health check is likely to report a critical or warning status. You should be sure your automated systems give servers enough time to sync before restarting them again.{% /admonition %}


### Upgrade

If the server reports `"amendment_blocked": true` in the health check, this indicates that the XRP Ledger has enabled a [protocol amendment](../../concepts/networks-and-servers/amendments.md) that your server doesn't understand. As a precaution against misinterpreting the revised rules of the network in a way that causes you to lose money, such servers become "amendment blocked" instead of operating normally.

To resolve being amendment blocked, [update your server](../installation/index.md) to a newer software version that understands the amendment.

Also, software bugs can cause a server to get [stuck not syncing](server-doesnt-sync.md). In this case, the `server_state` metric is likely to be in a warning or critical state. If you aren't using the latest stable release, you should upgrade to get the latest fixes for any known issues that could cause this.


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

The amount of load on a server in the XRP Ledger depends in part on transaction volume in the network, which varies organically. Load also depends on your usage pattern. See [Capacity Planning](../prerequisites/capacity-planning.md) for how to plan the appropriate hardware and settings for your situation.

Warning or critical values for the following [metrics][] may indicate insufficient hardware:

- `load_factor`
- `server_state`
- `validated_ledger`







[metrics]: ../../references/http-websocket-apis/peer-port-methods/health-check.md#response-format

{% raw-partial file="/docs/_snippets/common-links.md" /%}
