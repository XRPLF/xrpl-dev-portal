---
html: ledger-close-times.html
parent: ledgers.html
blurb: How the XRP Ledger calculates a unique close time value for each ledger version.
labels:
  - Blockchain
---
# Ledger Close Times

The time that a ledger version closed is recorded at the `close_time` field of the [ledger header](ledger-header.html). To make it easier for the network to reach a consensus on an exact close time, this value is rounded to a number of seconds based on the close time resolution, currently 10 seconds. If rounding would cause a ledger's close time to be the same as (or earlier than) its parent ledger's, the child ledger has its close time set to the parent's close time plus 1. This guarantees that the close times of validated ledgers are strictly increasing. <!-- STYLE_OVERRIDE: a number of -->

Since new ledger versions usually close about every 3 to 5 seconds, these rules result in a loose pattern where ledgers' close times end in :00, :01, :02, :10, :11, :20, :21, and so on. Times ending in 2 are less common and times ending in 3 are very rare, but both occur randomly when more ledgers randomly happen to close within a 10-second window.

Generally speaking, the ledger cannot make any time-based measurements that are more precise than the close time resolution. For example, to check if an object has passed an expiration date, the rule is to compare it to the close time of the parent ledger. (The close time of a ledger is not yet known when executing transactions to go into that ledger.) This means that, for example, an [Escrow](escrow.html) could successfully finish at a real-world time that is up to about 10 seconds later than the time-based expiration specified in the Escrow object.

### Example

The following examples show the rounding behavior of ledger close times, from the perspective of an example validator, following a ledger with the close time **12:00:00**:

**Current consensus round**

1. A validator notes that it was **12:00:03** when the ledger closed and entered consensus. The validator includes this close time in its proposals.
2. The validator observes that most other validators (on its UNL) proposed a close time of 12:00:02, and one other proposed a close time of 12:00:03. It changes its proposed close time to match the consensus of **12:00:02**.
3. The validator rounds this value to the nearest close time interval, resulting in **12:00:00**.
4. Since 12:00:00 is not greater than the previous ledger's close time, the validator adjusts the close time to be exactly 1 second after the previous ledger's close time. The result is an adjusted close time of **12:00:01**.
5. The validator builds the ledger with these details, calculates the resulting hash, and confirms in the validation step that others did the same.

Non-validating servers do all the same steps, except they don't propose their recorded close times to the rest of the network.

**Next consensus round**

1. The next ledger enters consensus at **12:00:04** according to most validators.
2. This rounds down again, to a close time of **12:00:00**.
3. Since this is not greater than the previous ledger's close time of 12:00:01, the adjusted close time is **12:00:02**.

**Next consensus round after that**

1. The ledger after that enters consensus at **12:00:05** according to most validators.
2. This rounds up, based on the close time resolution, to **12:00:10**.
3. Since this value is larger than the previous ledger's close time, it does not need to be adjusted. **12:00:10** becomes the official close time.
