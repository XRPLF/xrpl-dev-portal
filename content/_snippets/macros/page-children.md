{% macro page_children(pg, depth, max_depth, show_blurbs) %}
{% if pg.children %}
{% if depth == 1 %}<ul class="children-display">{% endif %}
  {% for child in pg.children %}
<li class="level-{{depth}}"><a href="{{child.html}}">{{child.name}}</a>
  {% if child.status == "not_enabled" %}:not_enabled:{% endif %}
  <p class="blurb child-blurb">{{child.blurb}}</p>
</li>
  {% if child.children and depth < max_depth %}
{{ page_children(child, depth+1, max_depth, show_blurbs) }}
  {% endif %}
  {% endfor %}

{% if depth == 1 %}</ul><!--/.children-display-->{% endif %}
{% endif %}
{% endmacro %}
