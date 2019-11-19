<!-- rippled release notes links -->

{% set rippled_versions = [
    "0.26.0",
    "0.26.1",
    "0.26.2",
    "0.26.3-sp1",
    "0.26.4",
    "0.26.4-sp1",
    "0.27.0",
    "0.27.1",
    "0.27.2",
    "0.27.3",
    "0.27.3-sp1",
    "0.27.3-sp2",
    "0.27.4",
    "0.28.0",
    "0.28.2",
    "0.29.0",
    "0.29.0-hf1",
    "0.30.0",
    "0.30.1",
    "0.31.0",
    "0.32.0",
    "0.32.1",
    "0.33.0",
    "0.50.0",
    "0.70.0",
    "0.70.2",
    "0.80.0",
    "0.80.1",
    "0.90.0",
    "1.0.0",
    "1.1.0",
    "1.2.0",
    "1.2.1",
    "1.3.1",
    "1.4.0",
] %}

{% for v in rippled_versions %}
[New in: rippled {{v}}]: https://github.com/ripple/rippled/releases/tag/{{v}} "BADGE_BLUE"
[Introduced in: rippled {{v}}]: https://github.com/ripple/rippled/releases/tag/{{v}} "BADGE_BLUE"
[Updated in: rippled {{v}}]: https://github.com/ripple/rippled/releases/tag/{{v}} "BADGE_BLUE"
[Removed in: rippled {{v}}]: https://github.com/ripple/rippled/releases/tag/{{v}} "BADGE_RED"
[導入: rippled {{v}}]: https://github.com/ripple/rippled/releases/tag/{{v}} "BADGE_BLUE"
[新規: rippled {{v}}]: https://github.com/ripple/rippled/releases/tag/{{v}} "BADGE_BLUE"
[更新: rippled {{v}}]: https://github.com/ripple/rippled/releases/tag/{{v}} "BADGE_BLUE"
[削除: rippled {{v}}]: https://github.com/ripple/rippled/releases/tag/{{v}} "BADGE_RED"
{% endfor %}
