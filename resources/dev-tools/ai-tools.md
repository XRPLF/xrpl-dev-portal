---
seo:
    description: Accelerate development on the XRPL with AI tools.
---
# AI Tools

Augment your AI with additional tools to accelerate development, automate integrations, and deploy secure solutions on the XRP Ledger.


## Model Context Protocol (MCP) Servers

AI models are limited by their training data, which will always be out-of-date with the most recent XRPL features and SDK improvements. MCP servers solve this by giving your AI real-time access to current documentation through a standardized interface. Instead of relying on potentially outdated training data, your AI can query an MCP server for accurate, up-to-date context. Below is a list of available MCP servers:

### Context7

[Context7](https://context7.com/) is a searchable database of user-submitted repos and websites. Official XRPL docs are maintained on the site and include:
- [xrpl.org](https://xrpl.org/docs): The official developer portal for up-to-date XRPL docs, including use cases, concepts, tutorials, references, and code samples.
- [opensource.ripple.com](https://opensource.ripple.com/): The technical doc site for all features in development by Ripple.
- [docs.xrplevm.org](https://docs.xrplevm.org/): The technical doc site for the XRPL EVM Sidechain.
- [XRPL JavaScript SDK](https://github.com/xrplf/xrpl.js)
- [XRPL Python SDK](https://github.com/xrplf/xrpl-py)
- [XRPL Go SDK](https://github.com/xrplf/xrpl-go)

To set up Context7, see: [Installation](https://github.com/upstash/context7?tab=readme-ov-file#installation).

### xrpl.org MCP Server

The xrpl.org site hosts a standalone MCP server, which only contains documentation hosted on the site. From any doc page, you can click the **Copy** dropdown by the page title and select either **Connect to Cursor** or **Connect to VS Code**. If you are using a different code editor, you can manually configure the MCP server using the `https://xrpl.org/mcp` endpoint.


## SKILL.md

A `SKILL.md` file provides behavioral instructions for AI models working with XRPL code. It defines specific steps and rules to produce more precise outcomes, such as forming transactions, implementing security best practices, or issuing tokens. By loading a skill in your coding agent, you reduce the need for verbose or repeated queries.

### XRPL Development Skill for Claude Code

A comprehensive Claude Code skill for modern XRP Ledger development, provided by XRPL Commons. This skill uses Claude Code's progressive disclosure pattern; the main `SKILL.md` provides core guidance, and Claude reads specialized markdown files only when needed for specific tasks. For a full list of available skills, as well as installation instructions, check the [GitHub repo](https://github.com/XRPL-Commons/xrpl-dev-skills?tab=readme-ov-file#xrpl-development-skill-for-claude-code).

### Generate Release Notes

The `generate-release-notes` skill generates a draft release notes to publish to the xrpl.org blog. This skill is intended for contributors to the XRPL docs. For additional details, check the [GitHub repo](https://github.com/XRPLF/xrpl-dev-portal/blob/master/.claude/skills/generate-release-notes/SKILL.md).


## Site Optimizations

The XRPL developer portal has been updated with AI optimizations to serve both human and AI audiences.

### AI Chatbot

An AI chatbot is hosted on [xrpl.org](https://xrpl.org/docs), [opensource.ripple.com](https://opensource.ripple.com/), and [docs.xrplevm.org](https://docs.xrplevm.org/) for users who prefer a more natural-language approach to documentation. You can access the chatbots from the **Ask AI** button at the bottom right of each website, or from the **Search with AI** button embedded in the search bar.

### llms.txt

The site hosts an [llms.txt](https://xrpl.org/llms.txt) file at the root directory, providing a curated index of content for AI crawlers and tools to find relevant information quickly. If you don't want to use the MCP servers, you can provide this file to your AI as context.

### Context Optimization

Markdown is an efficient format for providing documentation context to an AI. Every documentation page on the site hosts an `.md` version, which is accessible from the **Copy** dropdown at the top of the page. The dropdown includes options to:

- Copy the contents of the `.md` file.
- View the page as an `.md` file.
- Open **Claude** or **ChatGPT** with the contents of the page automatically loaded as context.
- Set up the xrpl.org MCP server in **VS Code** or **Cursor** with one click.
