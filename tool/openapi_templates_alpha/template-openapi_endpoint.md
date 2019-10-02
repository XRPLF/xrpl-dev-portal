# {{summary}}

{{description}}

**Warning:** {{spec.info.title}} is early alpha software. API methods and data formats are likely to change frequently in ways that break backwards compatibility.

## Request Format

```
{{method|upper}} {{path}}
{%- if method in ["post","put","delete"] and requestBody is defined %}

{{ x_example_request_body }}
{% endif %}
```

{% if path_params|length %}
This API method uses the following path parameters:

| Field | Value | Required? | Description |
|---|---|---|---|
{%- for param in path_params %}
| `{{param.name}}` | {% if param.schema is defined %}{% if param.schema.oneOf is defined %}(Varies){% else %}{{param.schema.type|title}}{% endif %} {% if param.schema["title"] is defined %}([{{param.schema.title}}]({{type_link(param.schema.title)}})){% endif %}{% else %}(Unspecified){% endif %} | {{"Required" if param.required else "Optional"}} | {{param.description}} |
{%- endfor %}

{% endif %}

{% if query_params|length %}
This API method uses the following query parameters:

| Field | Value | Required? | Description |
|---|---|---|---|
{%- for param in query_params %}
| `{{param.name}}` | {% if param.schema is defined %}{% if param.schema.oneOf is defined %}(Varies){% else %}{{param.schema.type|title}}{% if "items" in param.schema.keys() and "title" in param.schema["items"].keys() %} of [{{param.schema["items"].title}}]({{type_link(param.schema["items"].title)}}){% endif %}{% endif %} {% if param.schema["title"] is defined %}([{{param.schema.title}}]({{type_link(param.schema.title)}})){% endif %}{% else %}(Unspecified){% endif %} | {{"Required" if param.required else "Optional"}} | {{param.description}} |
{%- endfor %}

{% endif %}

{% if requestBody is defined %}
{{requestBody.description}}

{% if requestBody.content is defined %}

{% for mediatype,thisbody in requestBody.content.items() %}
{% if thisbody.schema is defined %}
**Media type:** {{mediatype|replace("*","\*")}}

{% if thisbody.schema.title is defined %}
Formatted as a [{{thisbody.schema.title}}]({{type_link(thisbody.schema.title)}})
{% endif %}
{% if thisbody.schema.properties is defined %}
The request uses the following fields:

| Field | Type | Required? | Description |
|-------|------|-----------|-------------|
{%- for name,field in thisbody.schema.properties.items() %}
| `{{name}}` | {{field.type|title}}{% if "items" in field.keys() and "title" in field["items"].keys() %} of [{{field["items"].title}}]({{type_link(field["items"].title)}}){% endif %} {% if field["title"] is defined %}([{{field.title}}]({{type_link(field.title)}})){% endif %} | {{"Required" if name in required else "May be omitted"}} | {% if field.description is defined %}{{field.description}}{% endif %} |
{%- endfor %}
{% endif %}

{% endif %}
{% endfor %}
{% endif %}
{% endif %}

## Response Formats

{% for response_code, response in responses.items() %}
### {{response_code}} {{HTTP_STATUS_CODES[response_code]}}

{{ response.description}}

{% if response.content is defined %}
{% for mediatype,thisbody in response.content.items() %}
{% if thisbody.schema is defined %}
**Media type:** {{mediatype|replace("*","\*")}}

{% if thisbody.schema.title is defined %}
Formatted as a [{{thisbody.schema.title}}]({{type_link(thisbody.schema.title)}})
{% endif %}
{% if thisbody.schema.properties is defined %}
The response uses the following fields:

| Field | Type | Required? | Description |
|-------|------|-----------|-------------|
{%- for name,field in thisbody.schema.properties.items() %}
| `{{name}}` | {{field.type|title}}{% if "items" in field.keys() and "title" in field["items"].keys() %} of [{{field["items"].title}}]({{type_link(field["items"].title)}}){% endif %} {% if field["title"] is defined %}([{{field.title}}]({{type_link(field.title)}})){% endif %} | {{"Required" if name in required else "May be omitted"}} | {% if field.description is defined %}{{field.description}}{% endif %} |
{%- endfor %}
{% endif %}{# TODO: handle allOf, etc. #}

{% if thisbody.examples is defined and thisbody.examples|length > 0 %}
#### Example Response(s)

{% for body_name,body_sample in thisbody.examples %}
_{{body_name}}_

```
{{body_sample|pprint}}
```
{% endfor %}
{% endif %}

{% endif %}
{% endfor %}

{% endif %}
{% endfor %}
