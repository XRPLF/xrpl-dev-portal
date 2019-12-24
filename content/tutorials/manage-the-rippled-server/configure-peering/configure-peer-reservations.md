# Configure Peer Reservations

A [peer reservation](peer-protocol.html#fixed-and-reserved-peers) is a setting that makes a `rippled` server always accept connections from a peer matching the reservation. 
***TODO: steps for the tasks below***



## Add a Peer Reservation

###

[peer_reservations_add method][]


## Remove a Peer Reservation

[peer_reservations_del method][]


## Check Peer Reservations

[peer_reservations_list method][]




## Disconnect an Unwanted Peer

No API for this but you can use a software firewall to block peers making excessive requests or on the wrong network chain. (see RBH script for examples)


## Check Peer Bandwidth Usage

[peers method][]



<!--{# common link defs #}-->
{% include '_snippets/rippled-api-links.md' %}
{% include '_snippets/tx-type-links.md' %}
{% include '_snippets/rippled_versions.md' %}
