The purpose of this document is to describe the steps one must perform to run
an "untrusted" rippled validator on an existing network.

# Vocabulary

- rippled node - A single running instance of rippled
- Validator - A rippled node that validates transactions
- Untrusted validator - A validator that is not included in the UNL of other validators on the network

# Binary installation

This document assumes that you are using Ubuntu 14.04.

1. [Install & configure a rippled validator](rippled-validator.html)

2. Stop rippled if it is currently running

        $ sudo service rippled stop

3. Add core validator IP addresses of the network you want to connect to to rippled.cfg

  For example the following IP addresses are the current Altnet core validators:

        [ips_fixed]
        54.92.66.122 51235
        54.67.72.173 51235
        52.16.66.76 51235
        54.93.66.235 51235
        52.74.67.18 51235
        52.64.9.71 51235
        54.207.20.165 51235
        54.172.212.33 51235
        52.11.28.194 51235
        54.94.245.104 51235
        54.65.200.22 51235
        52.1.205.132 51235

4. Add core validator validation public keys to rippled.cfg.

  For example the following keys are the current Altnet core validators' validation public keys:

        [validators]
        n9LnZ1AiyHmytkhLUr89dmL76uxZLzzyregvQVZFkVfqEQTCpg7B
        n9LJWexXc9wxzUKWZe4faTS4N9DUba3jNsByERZSa8MJc2bhCF7c
        n9MnXUt5Qcx3BuBYKJfS4fqSohgkT79NGjXnZeD9joKvP3A5RNGm
        n9LxyXSSrTZ482ceep9WGQnT2nknfzFMFgNL4wMjTUn3SfF3rhtS
        n9MTPLhEEjxcWHfqsXQhFoSUKaqYvU4E7B4yke39EMFm2DhFr43F
        n9Lw3j7THPhKLz2uDqBBWwyxHQC1Foyr3M6JeWCVyu7uhnhL6HA5
        n9L2XLFvcdriK34bCNXexzKMVcsZ9i4UG9J4pykR5c3J8gvBB6fw
        n9JCK3M4ci7b1XRq2wr1Ckd1HNq3Cg7NWrWiKyzJa4R5J489QGer
        n9LXZBs2aBiNsgBkhVJJjDX4xA4DoEBLycF6q8zRhXD1Zu3Kwbe4
        n9Kk6U5nSF8EggfmTpMdna96UuXWAVwSsDSXRkXeZ5vLcAFk77tr
        n9J1voqeu6iZQiLXaMofLeMbv8mbPskJWGYRtjdo8rmpvNdQRyEn
        n9KuCFBLq2GD4vJtoL3tebQJbhcHSd7tMqFM1x9bPK9wSagPJdd1
        
5. Adjust the validation quorum value in rippled.cfg

  This sets the minimum of trusted validations a ledger must have before the server considers it fully validated. Note that if you are validating, your validation counts.

  For example a validation quorum for a new Altnet validator could be set to

        [validation_quorum]
        10

6. Start rippled untrusted validator

        $ sudo service rippled start

The new untrusted validator will first sync with the existing network then start proposing and validating new transactions.

See [Creating a Trusted Rippled Validator](rippled-trusted-validator.html) on how to become a trusted validator on the network.
