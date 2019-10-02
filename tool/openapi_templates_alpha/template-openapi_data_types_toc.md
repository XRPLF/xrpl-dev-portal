# {{api_title}} Data Types

**Warning:** {{spec.info.title}} is early alpha software. API methods and data formats are likely to change frequently in ways that break backwards compatibility.

The following data types are defined for this API:

| Name | Type | Description |
|------|------|-------------|
{%- for key,schema in schemas %}
| `{{schema.title}}` | {{schema.type|title}}{% if "items" in schema.keys() and "title" in schema["items"].keys() %} of [{{schema["items"].title}}]({{type_link(schema["items"].title)}}){% endif %} {% if schema["title"] is defined %}([{{schema.title}}]({{type_link(schema.title)}})){% endif %} | {% if schema.description is defined %}{{schema.description}}{% endif %} |
{%- endfor %}
