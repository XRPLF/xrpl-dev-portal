---
seo:
    description: Learn how to contribute and maintain translations of the documentation on this website.
---
# Translations

The XRP Ledger Dev Portal (XRPL.org) is mostly written in English, so the English version is generally the most up-to-date and accurate version. However, to broaden the reach of the XRP Ledger software and community, this repository also contains translated versions of the documentation. We strongly encourage members of the community who understand other languages to contribute translations of the dev portal contents in their native languages.

The languages currently provided are:

| Language          | Code | Status |
|-------------------|------|--------|
| English           | (N/A) | Primary language, with most work and updates being done in English first. |
| Japanese (日本語)  | `ja` | Available on the site. Maintained on a best-effort basis, but sometimes not as up-to-date as the English version. |
| Spanish (Español) | `es-ES` | Incomplete, not actively maintained. Not currently served on the production site. |


## Translations Folder

The `@l10n` folder of the repository contains the translated docs for the site, including documentation pages (written in Markdown) and non-documentation pages such as dev tools that use the translations file to replace smaller strings of text where possible. Each translation exists in a separate folder identified by an [IETF BCP47](https://tools.ietf.org/html/bcp47) language code. Within the folder for a given language, the folder structure mirrors the top of the repository, such that content files whose path matches exactly are used instead of the English language versions. For example, `@l10n/ja/docs/concepts/accounts/index.md` is a Japanese-translated version of `docs/concepts/accounts/index.md`.

If there is not a parallel version of a file in the translation folder, the English version displays when you navigate to that page on the translated version of the site.


## Strings File

The `translations.yaml` file contains strings of text that are used in specially-stylized pages (with the `.page.tsx` extension) including dev tools and the "marketing" pages in the `about/` and `community/` sections of the site, and in some cases the `sidebars.yaml` file too.

Preferably, strings should use a key such as `topnav.docs.tutorials` to uniquely indicate the text being translated. Strings can also be matched by exactly the English text being translated, but matching by the English text is not ideal because the same text may need to be translated differently based on context, or different segments of text may need to be translated non-exactly to display correctly. The original files should be updated to use translation keys as needed.


## Moving or Renaming Files

When files are moved or renamed, the translated files also need to be moved or renamed the same way.

When you add redirects to the `redirects.yaml` file at the repository top, also add redirects for each translation (these are grouped later in the file).


## Where to Start

If you want to translate the XRP Ledger Dev Portal into your native language of choice, start with the {% repo-link path="docs/introduction/what-is-the-xrp-ledger.md" %}"What is the XRP Ledger?" page{% /repo-link %}, which introduces the core concepts behind the XRP Ledger.

Save the file as `@l10n/{language code}/docs/introduction/what-is-the-xrp-ledger.md`, where `{language code}` is the [IETF BCP47](https://tools.ietf.org/html/bcp47) language code. (For example, "es-ES" for Spanish (Spain), "ja" for Japanese, "zh-CN" for Simplified Chinese, "zh-TW" for Traditional Chinese as used in Taiwan, and so on.) Then open a [pull request](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/about-pull-requests) adding your file to this repository. One of the repository's maintainers can help with the other necessary setup to add the language to the site.

For the Markdown content files, please use the following conventions:

- Line-feed newline characters (`\n`) only (Unix style). Do not use carriage return (`\r`) characters (Windows style).
- Use UTF-8 encoding. Avoid the use of Byte-order marks.

To test changes with the translated version of the site, modify the `redocly.yaml` file at the repository top and add the language in question to the `l10n.locales` list:

```yaml
l10n:
  defaultLocale: en-US
  locales:
    - code: en-US
      name: English
    - code: ja
      name: 日本語
```

Then start the local dev server with `npm run start` from the repository top, use your web browser to view the local site, and choose the language from the dropdown in the main menu.
