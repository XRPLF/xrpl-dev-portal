---
date: 2016-08-18
labels:
    - Amendments
category: 2016
theme:
    markdown:
        editPage:
            hide: true
---
# The FlowV2 Amendment Was Vetoed

The `rippled` team found a flaw in FlowV2 while testing. As a result, the Ripple network has [vetoed](https://ripple.com/build/amendments/#amendment-voting) the new payment engine amendment. [Originally](https://developers.ripple.com/blog/2016/rippled-0.32.1.html), the [FlowV2 amendment](https://ripple.com/build/amendments/#flowv2) was planned to replace `rippled`’s payment processing engine with a more robust and efficient implementation. It was previously expected to become active on Wednesday, 2016-08-24.

A corrected version of the payment processing engine has been created and is now undergoing further testing. It is scheduled to be included in a future version of `rippled` as an amendment called [Flow](https://github.com/seelabs/rippled/blob/6466629f935821583eeddadbd06fabd9ea0875d0/src/ripple/app/main/Amendments.cpp#L50-L51).

This demonstrates the robustness of Ripple’s amendment process. The review period and governance code with vetoing working as intended.

## Action Recommended

No action is currently required. However, Ripple recommends that validator operators also veto the FlowV2 amendment to ensure it does not regain a majority.

To veto the amendment, add the following, single line, under the `[veto_amendments]` stanza to the `rippled.cfg` file on validators:

```
5CC22CFF2864B020BD79E0E1F048F63EF3594F95E650E43B3F837EF1DF5F4B26 FlowV2
```

## Learn, Ask Questions, and Discuss

Related documentation is available in the Ripple Developer Portal, including detailed example API calls and web tools for API testing: <https://ripple.com/build/>

### Other resources:

* The Ripple Forum (_Disabled._ Formerly `forum.ripple.com`)
* The Ripple Dev Blog: <https://developers.ripple.com/blog/>
* Ripple Technical Services: <support@ripple.com>
* XRP Chat: <http://www.xrpchat.com>
