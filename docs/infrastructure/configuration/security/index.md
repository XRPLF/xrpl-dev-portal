---
seo:
    description: Security posture per XRP Ledger server role.
metadata:
  indexPage: true
---
# Security

Each server role has a different exposure profile - a validator should be nearly invisible, a hub exists to accept strangers, a serving fleet defends an API. These pages give the posture per role. Common ground everywhere: admin interfaces on loopback (or, where fleet tooling needs more, behind an `admin` allowlist and a firewall), master keys off the box, default-deny firewalls, and verifying that protections are actually enforced rather than merely configured. On a Docker host that last point matters most: ports published by Docker bypass `ufw`, so publish a port that only the host needs on `127.0.0.1` (for example `-p 127.0.0.1:5005:5005`), restrict any other published port with a rule in the `DOCKER-USER` chain, and test from another machine.

{% child-pages /%}
