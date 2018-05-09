# Markers and Pagination

Some methods return more data than can efficiently fit into one response. When there are more results than contained, the response includes a `marker` field. You can use this to retrieve more pages of data across multiple calls. In each request, pass the `marker` value from the previous response to resume from the point where you left off. If the `marker` is omitted from a response, then you have reached the end of the data set.

The format of the `marker` field is intentionally undefined. Each server can define a `marker` field as desired, so it may take the form of a string, a nested object, or another type. Different servers, and different methods provided by the same server, can have different `marker` definitions. Each `marker` is ephemeral, and may not work as expected after 10 minutes.
