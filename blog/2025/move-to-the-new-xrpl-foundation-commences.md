---
category: 2025
date: 2025-02-19
seo:
    title: Move to the New Foundation Commences
    description: With the new XRPL Foundation now incorporated in France, the Founding Members are migrating assets from the previous entity. Learn about the Unique Node List (UNL) transition and necessary actions for community members.

labels:
    - General
markdown:
    editPage:
        hide: true
---
# Move to the New XRPL Foundation Commences

_By the XRPL Foundation_

Late last year the initial groundwork for the launch of the new XRPL Foundation was laid, including the [incorporation of the new Foundation](../2024/a-new-era-for-the-xrp-ledger.md) in France. This major milestone has enabled the Founding Members (XRPL Commons, XRPL Labs, Ripple, and XAO DAO) to continue with immediate next steps. In line with this, the migration of assets (listed in an [earlier blog post](../2024/a-new-era-for-the-xrp-ledger.md)) from the previous entity to the newly established Foundation is now underway.

The migration includes the transition of the Unique Node List (UNL) published by the old XRPL Foundation to the new XRPL Foundation. Importantly, any validators and node operators that rely on the old UNL will need to update their configurations to reflect the new Foundation’s infrastructure.

To ensure continued network participation and avoid potential downtime, validators and node operators must take this action **by Monday, March 10, 2025**.

### Why this Transition Matters

Throughout its history, the XRPL Foundation has played a critical role in maintaining the security and decentralized status of the XRPL by publishing a trusted UNL. Validators and node operators are able to contribute to maintaining an up-to-date, secure, and well-managed network by updating their configurations to the new UNL, ensuring a smoother and more reliable blockchain infrastructure.

### Required Actions for Validators

Ahead of the migration date, validators need to take the following actions:

1. Update their configuration to reflect the new cryptographic public key provided by the new Foundation.
2. Restart their node to apply the updated configuration.

Failure to complete these actions may result in network disruptions, impacting connectivity and participation in consensus processes. 

Detailed instructions of the actions validators and node operators are required to take are below.

The transition to the new XRPL Foundation marks an important step in ensuring the continued stability and security of the XRPL network. Validators and node operators play a pivotal role in this process, and their timely action is crucial for maintaining a robust and decentralized infrastructure. 

As the migration from the old to the new Foundation progresses, additional support and updates will be provided on XRPL.org to ensure a seamless transition for all participants.


## Actions To Take

### Steps

If your XRP Ledger node currently trusts the UNL published by the XRP Ledger Foundation, complete the following steps to update your settings:

1. **Edit validators.txt**

    Update the [`validator_list_keys`] section (the current endpoint remains unchanged) to replace the old key (`ED45D1840EE724BE327ABE9146503D5848EFD5F38B6D5FEDE71E80ACCE5E6E738B`) with the following:

    ```
    [validator_list_keys]
    ED42AEC58B701EEBB77356FFFEC26F83C1F0407263530F068C7C73D392C7E06FD1
    ```

2. **Restart _rippled_**
  
    After saving the changes, restart your `rippled` service. On supported platforms, you can run the following command:
    
    ```json
    sudo systemctl restart rippled.service
    ```

3. **Confirm the New Settings**

    Run:

    ```
    /opt/ripple/bin/rippled validators
    ```

    The output should display the updated values in the `publisher_lists` key:

    ```json
    {
    "result": {
      "local_static_keys": [],
      "publisher_lists": [
        {
         "available": true,
         ...
         "list": [
            ...
          ],
          "pubkey_publisher": "ED42AEC58B701EEBB77356FFFEC26F83C1F0407263530F068C7C73D392C7E06FD1",
          "seq": 1,
          "uri": "https://vl.xrplf.org",
          "version": 1
        },
	  ...
        ]
      ...
  }
  ```