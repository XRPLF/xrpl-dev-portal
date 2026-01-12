---
html: contribute-blog.html
parent: resources.html
seo:
  description: Contribution guide for XRPL Blog.
labels:
  - Blockchain
---

# Contribute a Blog Post

Thanks for considering a contribution to the XRP Ledger Dev Blog!

This page includes high-level instructions to create a new blog post. Detailed instructions and guidelines to contribute to the XRPL Developer Portal are available in [Contribute Documentation](../contribute-documentation/index.md).

{% admonition type="info" name="Note" %}Blog posts are currently only available in English and are not yet translated.{% /admonition %}

## Directory Structure for Blog Posts

The source files are located in the `blog` directory of the public `xrpl-dev-portal` repository.

The image files used in blog posts are located in the `blog/img` directory.

The blog posts are grouped by year, so all blog posts published in year 2025 are located in the `blog/2025` directory.

## Steps to Create a New Blog Post

To create a new post, follow these steps:

1. Before you begin, ensure that you pull the most recent updates from the upstream `master` branch of the `xrpl-dev-portal` repository.

2. Create a new branch for the blog post using the format `blog-{short-desc-of-update}`.

3. Create a new markdown file in the `blog/{YEAR}` folder, for example https://github.com/XRPLF/xrpl-dev-portal/tree/master/blog/2025

4. Refer to the template file [`_blog_template.md`](https://github.com/XRPLF/xrpl-dev-portal/tree/master/resources/contribute-blog/_blog-template.md) to compose your draft blog.

5. Update the `blog/sidebars.yaml` file to include the newly created file.

6. When the draft is ready for review, save and commit your updates.

7. Create a new PR to merge your changes to master.
