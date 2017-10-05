<?php

$devPortalPages = array(
  {% for page_filename, page_url in target.link_subs.items() %}
    {% set wp_page_id = page_url[:-1]|replace("https://ripple.com/build/", "") %}
    {% if "/" not in wp_page_id and "-tool" not in wp_page_id %}
  '{{wp_page_id}}'  => '{{page_filename}}',
    {% endif %}
  {% endfor %}
);

?>
