---
seo:
    description: What to decide and provision before running an XRP Ledger server.
metadata:
  indexPage: true
---
# Prerequisites

Before installing anything, three decisions shape everything after: which [role](node-types.md) the server plays, what [hardware and hosting](system-requirements/index.md) that role needs, and how much [history](capacity-planning.md) it keeps. Get those right and the rest of these docs are a sequence; get them wrong and you rebuild later. If you only want to try the XRP Ledger or run a test server, start with [Development and Testing](system-requirements/development-and-testing.md) instead.

Read in this order: [How the Network Fits Together](how-the-network-fits-together.md) if the roles are new to you, then [Node Types](node-types.md) to choose the role, the role's [System Requirements](system-requirements/index.md) page, [Capacity Planning](capacity-planning.md) for `node_size` and performance tuning, then [Monitoring](monitoring.md) and [Backup and Recovery](backup-and-recovery.md) - both are cheaper to set up before the server matters than after.

{% child-pages /%}
