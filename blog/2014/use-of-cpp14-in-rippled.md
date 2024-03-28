---
date: 2014-08-19
category: 2014
labels:
    - Development
theme:
    markdown:
        editPage:
            hide: true
author: Howard Hinnant
---
# Use of C++14 in rippled

C++ is a language under constant development, resulting in alternating minor and major releases. The last major release of C++ was C++11.  [A minor release](https://isocpp.org/blog/2014/08/we-have-cpp14) has just been approved by all participating national bodies (zero negative votes). This will be C++14. C++17 is the next planned major release and is currently under development by the committee.

Rippled has already adopted a number of useful C++14 features. We’ve done this through the development environment where native support is available, or by emulating the features through providing compatible implementations using our beast cxx14 compatibility library ( [https://github.com/ripple/rippled/tree/develop/src/beast/beast/cxx14](https://github.com/ripple/rippled/tree/0.26.2/src/beast/beast/cxx14)).

<!-- BREAK -->

A brief list of notable features:

- Use of [std::make_unique](http://www.open-std.org/jtc1/sc22/wg21/docs/papers/2013/n3656.htm)<b> </b>for secure and exception safe allocations. For a more in-depth discussion, have a look at this wikipedia article on [Resource Acquisition is Initialization](http://en.wikipedia.org/wiki/Resource_Acquisition_Is_Initialization)

- Simplified use of type transformations with [type aliased type_traits](http://www.open-std.org/jtc1/sc22/wg21/docs/papers/2013/n3655.pdf). See cppreference.com for [some developer friendly details](http://en.cppreference.com/w/cpp/language/type_alias).

- Resistance to buffer overrun attacks via [secure &lt;algorithm&gt;](http://www.open-std.org/jtc1/sc22/wg21/docs/papers/2013/n3671.html)

- [integer_sequence](http://www.open-std.org/jtc1/sc22/wg21/docs/papers/2013/n3658.html) facilitates interoperation with the `boost::asio` asynchronous network library

Like its predecessors, C++14 represents another significant improvement to an already-great language in the area of producing verifiably correct and concise algorithms. Since Ripple Labs operates in the space of financial transactions, the rippled team uses all available tools to ensure that its software behaves predictably and remains auditable to field experts.

_Howard Hinnant is a Sr. C++ Engineer at Ripple Labs as well as Library Working Group Chair Emeritus at the Standard C++ Foundation. He was lead author of several C++11 features including: move semantics, `unique_ptr`, and the headers `<mutex>`,  `<condition_variable>` and `<chrono>`. For C++14 he contributed the `<shared_mutex>` library. Howard was the lead author of the `std::lib` implementation libc++ found at libcxx.llvm.org._
