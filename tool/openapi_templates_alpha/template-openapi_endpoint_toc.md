# {{info.title}} {{info.version}} Methods

{{info.description}}

**Warning:** {{spec.info.title}} is early alpha software. API methods and data formats are likely to change frequently in ways that break backwards compatibility.

{% if tags %}
View API methods by category:

{% for tag in tags %}
- [{{tag.name|title}} Methods](#{{slugify(tag.name)|lower}}-methods)
{% endfor %}
{% endif %}

{% for tag in tags %}
{% if endpoints_by_tag(tag.name)|list|length %}
## {{tag.name|title}} Methods

{{tag.description}}

| Summary | Path |
|:--------|:-----|
{%- set reflinks = [] -%}
{%- for path,method,endpoint in endpoints_by_tag(tag.name) %}
{%- set _ = reflinks.append("["+endpoint.summary+"]: "+method_link(path, method, endpoint) ) %}
| [{{endpoint.summary}}][] | [`{{method|upper}} {{path}}`][{{endpoint.summary}}] |
{%- endfor %}

{% for reflink in reflinks -%}
{{reflink}}
{% endfor %}

{% endif %}
{% endfor %}

{% if endpoints_by_tag("Uncategorized")|list|length %}
## Uncategorized Methods

| Name | Path | Summary |
|:-----|:-----|:--------|
{%- set reflinks = [] -%}
{%- for path,method,endpoint in endpoints_by_tag("Uncategorized") %}
{%- set _ = reflinks.append("["+endpoint.operationId+"]: "+method_link(path, method, endpoint) ) %}
| [{{endpoint.operationId}}][] | [`{{method|upper}} {{path}}`][{{endpoint.operationId}}] | {{endpoint.summary}} |
{%- endfor %}

{% for reflink in reflinks -%}
{{reflink}}
{% endfor %}

{% endif %}
