The purpose of this document is to describe the steps one must perform to run
a rippled validator that starts from a fresh ledger and is not connected to any existing network.

# Vocabulary

- rippled node - A single running instance of rippled
- Validator - A rippled node that validates transactions

# Binary installation

This document assumes that you are using Ubuntu 14.04.

1. [Install & configure a rippled node](rippled-stock-node.html)

2. Start rippled

        $ sudo service rippled start

3. Generate a validator key and save the output

        $ rippled --conf /etc/rippled/rippled.cfg -q validation_create
        {
            "status" : "success",
            "validation_key" : "FOLD WERE CHOW WIT SWIM RANK WED DAN LAIN TRIO MURK NELL",
            "validation_public_key" : "n9KHn8NfbBsZV5q8bLfS72XyGqwFt5mgoPbcTV4c6qKiuPTAtXYk",
            "validation_seed" : "ssdecohJMDPFuUPDkmG1w4objZyp4"
        }

4. Stop rippled

        $ sudo service rippled stop

5. Add the generated validator signing key from above to rippled.cfg

        [validation_seed]
        ssdecohJMDPFuUPDkmG1w4objZyp4
        
6. Add validation quorum value to rippled.cfg

        [validation_quorum]
        0

7. Start rippled validator as the first node starting at a fresh ledger

        $ sudo start-stop-daemon --start --quiet --background -m --pidfile /var/run/rippled.pid --exec /usr/sbin/rippled --chuid rippled --group rippled -- --start --conf /etc/rippled/rippled.cfg

See [Configuring rippled to trust other validators](rippled-untrusted-validator.html) to learn how additional nodes can be added to the new network.
