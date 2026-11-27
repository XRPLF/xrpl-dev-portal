---
seo:
    description: Choose the right XRP Ledger server role - stock, validator, full history, hub, pathfinding, or Clio.
labels:
  - Core Server
---
# Node Types

Every `xrpld` (formerly `rippled`) server runs the same software; the role is a matter of configuration and commitment. Clio, the last row below, is a separate program that reads from `xrpld`. Pick the role first - it decides your hardware, your costs, and which of the rest of these docs you need. If the roles are new to you, read [How the Network Fits Together](how-the-network-fits-together.md) first.

| Role | Run it if | Hardware profile | Commitment |
|:-----|:----------|:-----------------|:-----------|
| [Stock node](../configuration/server-modes/stock-node.md) | You build on the XRPL and want your own trusted view and submission path | Modest; 32 GB and local NVMe | Low - the default role, and the right first server |
| [Validator](../configuration/server-modes/validator.md) | You want to participate in consensus and strengthen the network | Modest but *consistent*; about $60 to $120 a month (USD) rented, less on hardware you own | Identity and uptime are public; years, not months |
| [Hub](../configuration/server-modes/hub.md) | You have bandwidth to give and want to carry peering capacity | Server-class but mostly idle; heavy network (11 to 15 TiB a month) | Others' servers come to depend on yours |
| [Full history](../configuration/server-modes/full-history.md) | You operate an explorer, indexer, or public data service | Tens of TB, owned hardware, multiple servers | A storage project measured in years |
| [Pathfinding](../configuration/server-modes/pathing.md) | You serve cross-currency path queries at volume | Dedicated capacity for expensive queries | Few operators need this role |
| [Clio](../configuration/server-modes/clio.md) | You serve heavy API/history traffic and want it off `xrpld` | A database cluster plus readers | An indexing deployment in its own right |

Rules of thumb from production operators: almost everyone's first server should be a stock node; a validator is a stock node plus an identity and a discipline, not a bigger machine; and the serving roles (hub, full history, Clio) are commitments to other people, so take them on deliberately.

Start with [System Requirements](system-requirements/index.md) for your chosen role, then [Capacity Planning](capacity-planning.md) for `node_size` and performance tuning, then the role's configuration pages. Set up [Monitoring](monitoring.md) and [Backup and Recovery](backup-and-recovery.md) before the server goes into service; [Prerequisites](index.md) has the full order.
