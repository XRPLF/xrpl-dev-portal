---
date: 2016-06-12
category: 2016
labels:
    - Release Notes
theme:
    markdown:
        editPage:
            hide: true
---
# Introducing RippleAPI

Ripple is proud to announce an improved, unified interface to the Ripple Consensus Ledger: the new **RippleAPI**! RippleAPI merges ripple-lib and Ripple-REST into a single high-level interface for JavaScript that is fully-documented, fully-tested, schema-validated, stateless, and easier to use.

If you’re excited to get started with the new RippleAPI right away, jump right in with the following resources:

1.  [RippleAPI Beginners Guide](https://ripple.com/build/rippleapi-beginners-guide/) - A tutorial that introduces the basics of RippleAPI, even if you have minimal prior experience writing JavaScript applications.
2.  [RippleAPI Reference](https://ripple.com/build/rippleapi/) - A thorough reference of all methods and features contained in the new API.
3.  [Sample Code](https://github.com/ripple/ripple-lib/tree/develop/docs/samples) - Additional code samples for a growing variety of use cases.
4.  [`ripple-lib` on GitHub](https://github.com/ripple/ripple-lib) - The RippleAPI source code is available under an open-source license so you can freely download, modify, and contribute back to the project.

For more information on how and why we built RippleAPI, read on.

## Background and Rationale

Prior to RippleAPI, there were three very different APIs to the Ripple Consensus Ledger:

1.  The `rippled` APIs: a low-level interface, not designed for ease of use.
2.  The ripple-lib API: a low-level javascript interface, largely undocumented
3.  The Ripple-REST API: a high-level HTTP interface

In order to better focus our efforts as a company, as well as providing a better experience for all users, we merged \#2 and \#3 into a single high-level JavaScript interface.

Unfortunately, all good things come to an end, and this is the end of the line for Ripple-REST. We are no longer developing or supporting Ripple-REST, and we recommend you migrate your applications away from it. Fortunately, RippleAPI also includes an [experimental REST-like HTTP API](https://github.com/ripple/ripple-lib/blob/0.17.1/src/index.js#L7-L8), although this interface is currently unsupported.

Meanwhile, the [`rippled` APIs](https://ripple.com/build/rippled-apis/) continue to provide an alternative method of interacting with the Ripple Consensus Ledger, providing maximum power at a cost of increased complexity, so you can choose the tradeoffs that are best for your use case.

## Source Code Improvements

The RippleAPI source code is written in ECMAScript 6 (the latest JavaScript standard) and uses [Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) to return values from asynchronous calls. The new source code also follows many of the paradigms of [functional programming](https://en.wikipedia.org/wiki/Functional_programming). The result is that the we reduced 15,000 lines of source code in ripple-lib and 6,000 lines in Ripple-REST to just 4,000 lines total in RippleAPI.

For better organization, we used the “weak layering principle” to structure the source, according to which each layer can only depend on layers below it. This means that the source files are structured into subdirectories and there are very few imports that reach into parent or sibling directories.

## Testing and Documentation

RippleAPI comes with a comprehensive array of tests, including 100% unit test coverage, integration tests for every method, flow type checking, ESLint checks, and automated testing of the documentation.

All API methods have JSON schemas that specify the return values and parameter types. The unit tests use the schemas to validate the return values, which guarantees that the API results are consistent with expectations.

We generate human-readable documentation using Embedded JavaScript, which utilizes the schemas to generate parameter tables and the test fixtures as code samples. Every Git commit comes with the latest copy of the resulting Markdown documentation, thanks to unit tests which ensure that the documentation has been re-generated whenever changes are made. As long as the unit tests are passing, the documentation is consistent with the tests, and therefore with the source code.

## Conclusion

We hope that RippleAPI will help developers harness the power of the Ripple Consensus Ledger. So [get started](https://xrpl.org/get-started-with-rippleapi-for-javascript.html), and let us know on the forums how we’re doing!
