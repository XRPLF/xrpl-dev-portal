---
seo:
    description: Reference documentation for the XRP Ledger protocol, API methods, and more. 
---
# References

The XRP Ledger References provides reference documentation for the XRP Ledger protocol, API methods, and more. 

## Client Libraries

Use these libraries to access the XRP Ledger from your programming language of choice.

{% card-grid %}

{% xrpl-card title="JavaScript / TypeScript" body="xrpl.js - a JavaScript/TypeScript library" href="https://js.xrpl.org/" image="/img/logos/javascript.svg" imageAlt="Javascript logo" /%}

{% xrpl-card title="Python" body="xrpl.py - a pure Python library" href="https://xrpl-py.readthedocs.io/" image="/img/logos/python.svg" imageAlt="Python logo" /%}

{% xrpl-card title="Java" body="xrpl4j - a pure Java library" href="https://javadoc.io/doc/org.xrpl/" image="/img/logos/java.svg" imageAlt="Java logo" /%}

{% /card-grid %}

[See more...](/docs/references/client-libraries/)

## XRP Ledger Protocol Reference

{% card-grid %}

{% xrpl-card title="Basic Data Types" body="Format and meaning of fundamental data types." href="/docs/references/protocol/data-types/basic-data-types/" /%}

{% xrpl-card title="Ledger Data Formats" body="Learn about individual entries that comprise the XRP Ledger's shared state data." href="/docs/references/protocol/ledger-data/" /%}

{% xrpl-card title="Transaction Reference" body="Definitions for all the protocol's transaction types and their results." href="/docs/references/protocol/transactions/" /%}

{% xrpl-card title="Binary Format" body="Conversion between JSON and canonical binary format for XRP Ledger transactions and other objects." href="/docs/references/protocol/binary-format/" /%}

{% /card-grid %}

## HTTP / WebSocket APIs

{% card-grid %}

{% xrpl-card title="API Conventions" body="Describes data types and formats of the HTTP APIs (JSON-RPC and WebSocket) as implemented in the rippled server." href="/docs/references/http-websocket-apis/api-conventions/" /%}

{% xrpl-card title="Public API Methods" body="Public API methods for use by any client attached to the server." href="/docs/references/http-websocket-apis/public-api-methods/" /%}

{% xrpl-card title="Admin API Methods" body="Admin methods for trusted personnel in charge of keeping the rippled server operational." href="/docs/references/http-websocket-apis/admin-api-methods/" /%}

{% xrpl-card title="Peer Port Methods" body="Special API methods for sharing network topology and status metrics, served on the XRPL Peer Protocol port." href="/docs/references/http-websocket-apis/peer-port-methods/" /%}

{% /card-grid %}

## xrp-ledger.toml File

The xrp-ledger.toml file provides machine-readable information about your usage of the XRP Ledger to other XRP Ledger users.

- [**Serving the File**](/docs/references/xrp-ledger-toml/#serving-the-file)
- [**Contents**](/docs/references/xrp-ledger-toml/#contents)
- [**CORS Setup**](/docs/references/xrp-ledger-toml/#cors-setup)
- [**Domain Verification**](/docs/references/xrp-ledger-toml/#domain-verification)
- [**Account Verification**](/docs/references/xrp-ledger-toml/#account-verification)
