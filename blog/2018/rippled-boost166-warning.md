---
date: 2018-01-12
category: 2018
labels:
    - Advisories
    - Development
theme:
    markdown:
        editPage:
            hide: true
---
# Boost 1.66 Not Supported for rippled 0.81.0

A warning to developers: `rippled` versions 0.81.0 and earlier do not compile with the recently-released Boost library version 1.66.0. To compile `rippled` yourself, Ripple recommends using **Boost version 1.65.1**. The minimum supported version of Boost is 1.58.0, which is included in the official repositories of Ubuntu 16.04 Xenial.

## Compiler Errors

If you try to compile `rippled` version 0.81.0 with Boost version 1.66.0 or higher, you get compiler errors such as the following:

```
In file included from src/beast/include/beast/core/detail/type_traits.hpp:13:0,
                 from src/beast/include/beast/core/impl/static_string.ipp:12,
                 from src/beast/include/beast/core/static_string.hpp:1106,
                 from src/beast/include/beast/core/string_param.hpp:13,
                 from src/beast/include/beast/http/fields.hpp:12,
                 from src/beast/include/beast/http/message.hpp:12,
                 from src/ripple/server/Handoff.h:24,
                 from src/ripple/overlay/Overlay.h:26,
                 from src/ripple/app/consensus/RCLConsensus.cpp:39,
                 from src/ripple/unity/app_consensus.cpp:21:
/usr/include/boost/asio/io_service.hpp:27:20: error: conflicting declaration
 ‘typedef class boost::asio::io_context boost::asio::io_service’
 typedef io_context io_service;
```

If you encounter this issue, please downgrade to Boost version 1.65.1.

## Background

Boost 1.66.0 [introduces the `Boost.Beast` library for HTTP and WebSocket connections](http://www.boost.org/doc/libs/1_66_0/libs/beast/doc/html/beast/introduction.html). The Beast library was built by [prolific coder and Ripple alum Vinnie Falco](https://github.com/vinniefalco) as an add-on to the `Boost.Asio` library, for use in `rippled` and other C++ software. Because Beast made its start in the `rippled` code base, the version already included in `rippled` conflicts with the version included as part of the Boost library in versions 1.66.0 and higher.

## Future Work

Ripple expects to make `rippled` compatible with Boost 1.66.0 and higher in a future release. At that time, `rippled` will no longer be compatible with Boost version 1.65.x and lower. Stay tuned to `rippled` release announcements for updates on this transition.
