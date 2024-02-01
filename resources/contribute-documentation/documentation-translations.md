---
html: documentation-translations.html
parent: contribute-documentation.html
seo:
    description: Learn how to contribute and maintain translations of the documentation on this website.
---
# Translations

The XRP Ledger Dev Portal is mostly written in English, so the English version is generally the most up-to-date and accurate version. However, to broaden the reach of the XRP Ledger software and community, this repository also contains translated versions of the documentation. We strongly encourage members of the community who understand other languages to contribute translations of the dev portal contents in their native languages.

The `dactyl-config.yml` contains a "target" entry for each available language. (Currently, the available languages are English and Japanese.) This entry includes a dictionary of strings used in the template files. For example:

```yaml
-   name: en
    lang: en
    display_name: XRP Ledger Dev Portal
    # These github_ fields are used by the template's "Edit on GitHub" link.
    #  Override them with --vars to change which fork/branch to edit.
    github_forkurl: https://github.com/XRPLF/xrpl-dev-portal
    github_branch: master
    strings:
        blog: "Blog"
        search: "Search site with Google..."
        bc_home: "Home"
        # ...
```

There is also a top-level `languages` listing that defines some properties for each supported language. The short code for each language should be short code according to [IETF BCP47](https://tools.ietf.org/html/bcp47). For example, "en" for English, "es" for Spanish, "ja" for Japanese, "zh-CN" for Simplified Chinese, "zh-TW" for Traditional Chinese (as used in Taiwan), and so on. The `display_name` field defines the language's name as written natively in that language. The `prefix` field defines a prefix to be used in hyperlinks to that language's version of the site. Example `languages` definition:

```yaml
languages:
    -   code: en
        display_name: English
        prefix: "/"
    -   code: ja
        display_name: 日本語
        prefix: "/ja/"
```

The same `dactyl-config.yml` file contains an entry for each content page in the XRP Ledger Dev Portal. If a page has been translated, there is a separate entry for each translation, linked to the "target" for that translation. If a page has not yet been translated, the English version is used across all targets. (If a new page is added only to English and not other languages, the link checker reports that as a broken link.)

Translating a page means separating out the entry for that page in the other language. Here are some tips for translating the page's metadata, which can be in either the `dactyl-config.yml` file or the frontmatter at the top of the page's Markdown file:

| Field | Notes |
|-------|-------|
| `html` | The HTML file name of the page. By convention, this should be the same across all language versions. |
| `md` | The Markdown source file for the page. Translated Markdown source files should use the same filename as the English-language version except that the file extension should be `.{language code}.md` instead of only `.md` for English. For example, Japanese translated files end in `.ja.md`. |
| `blurb` | A short summary of the page. This should be translated. This text is used in metadata for search engine optimization and also on automatically-generated landing pages. |


Example of English and Japanese entries for the `server_info` method page:

```yaml
    -   md: references/http-websocket-apis/public-api-methods/server-info-methods/server_info.md
        targets:
            - en

    -   md: references/http-websocket-apis/public-api-methods/server-info-methods/server_info.ja.md
        targets:
            - ja
```

Example entry for a page that isn't translated:

```yaml
    -   md: concepts/payment-system-basics/transaction-basics/source-and-destination-tags.md
        targets:
            - en
            - ja
```

## Where to Start

If you want to translate the XRP Ledger Dev Portal into your native language of choice, start with the {% repo-link path="docs/concepts/introduction/what-is-the-xrp-ledger.md" %}"What is the XRP Ledger?" page{% /repo-link %}, which introduces the core concepts behind the XRP Ledger.

Save the file as `what-is-the-xrp-ledger.{language code}.md`, where `{language code}` is the [IETF BCP47](https://tools.ietf.org/html/bcp47) language code. (For example, "es" for Spanish, "ja" for Japanese, "zh-CN" for Simplified Chinese, "zh-TW" for Traditional Chinese as used in Taiwan, and so on.) Then open a [pull request](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/about-pull-requests) adding your file to this repository. One of the repository's maintainers can help with the other necessary setup to add the language to the site.

For the Markdown content files, please use the following conventions:

- Line-feed newline characters (`\n`) only (Unix style). Do not use carriage return (`\r`) characters (Windows style).
- Use UTF-8 encoding. Avoid the use of Byte-order marks.
