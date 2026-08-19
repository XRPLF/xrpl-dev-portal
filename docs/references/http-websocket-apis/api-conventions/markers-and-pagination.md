---
html: markers-and-pagination.html
parent: api-conventions.html
seo:
    description: Convention for paginating large queries into multiple responses.
---
# Markers and Pagination

Some methods return more data than can efficiently fit into one response. When there are more results than contained, the response includes a `marker` field. You can use this to retrieve more pages of data across multiple calls. In each request, pass the `marker` value from the previous response to resume from the point where you left off. If the `marker` is omitted from a response, then you have reached the end of the data set.

The format of the `marker` field is intentionally undefined. Each server can define a `marker` field as desired, so it may take the form of a string, a nested object, or another type. Different servers, and different methods provided by the same server, can have different `marker` definitions. Each `marker` is ephemeral, and may not work as expected after 10 minutes.

When a query's results span multiple pages, request a specific [ledger version](../../../concepts/ledgers/open-closed-validated-ledgers.md) instead of a shorthand such as `current` or `validated`. A shorthand can resolve to a different ledger version on each call, because the network validates a new ledger every few seconds, so paging with one can return inconsistent or incomplete results. As the examples below show, make the first request with the shorthand, save the `ledger_index` from the response, then pass that exact `ledger_index` value (along with the `marker`) in each of the following requests.

{% tabs %}

{% tab label="Python" %}
{% code-snippet file="/_code-samples/markers-and-pagination/py/pagination-with-markers.py" language="py" /%}
{% /tab %}

{% tab label="JavaScript" %}
{% code-snippet file="/_code-samples/markers-and-pagination/js/pagination-with-markers.js" language="js" /%}
{% /tab %}

{% /tabs %}
