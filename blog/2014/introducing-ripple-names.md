---
date: 2014-04-28
category: 2014
labels:
    - Features
theme:
    markdown:
        editPage:
            hide: true
---
# Introducing Ripple Names

Ripple names work in conjunction with Ripple addresses as a destination to receive funds, as an identifier for the sender, and as a handle to set trustlines.


## Ripple name specifications

- Have 1-20 characters

- Valid characters include “a” through “z”, “0” through “9”, and dash “-”

-  Leading, trailing, and two or more adjacent dashes are not allowed

Names will be canonicalized, meaning:

-  Case insensitive, e.g. TheABCs is the same as theabcs

-  Hyphens are ignored, e.g. the-abcs is the same as theabcs

## Implementation

We are designing a system for the Ripple network. Because protocol level changes are irreversible, we have decided to develop an off-network implementation.

In this implementation, we reserve the right to set aside names that can be claimed by authorized entities.

Reserved list:

- All 1-character and 2-character names

- The most visited 100,000 domains

- Current [name]@ripple.com addresses

- Application requests in sunrise period (open through 04/30/2014)

- Subset of Google’s n-gram database

## Application Requirements

Applying for a name and completing the payment does not guarantee that that Ripple name will be claimable. Applications must show some previous or intended use of the name, which can include, but is not limited to:

- Having a registered business, or doing-business-as, with that name

- Owning and controling a related domain name

- Not infringing on known trademarks or servicemarks

- Not intended to confuse or mislead

Applications will be reviewed in early May.

To apply for a Ripple name, please fill out the name application form _(formerly `names.ripple.com`)_ and complete a payment of 10,000 XRP to rrrrrrrrrrrrrrrrrNAMEtxvNvQ. XRP sent to this address will be unspendable. This is known as a [black hole address](https://xrpl.org/accounts.html#special-addresses).

If you have additional questions, please email support@ripple.com.
