var TARGET_XRPL_DEV_PORTAL_BRANCH = "main";
var PROMPT_MODE = "prompt";
var RUNTIME_LOCATION = "ripplex";
var DEV_XRPLAI_RIPPLEX_IO_PROJECT_KEY = `uPcw5BckVeKgyF2NE6la4VVFtA56OBQ4`;
var DEV_XRPLAI_RIPPLEX_API_BASE_URL = "https://api.ai.xrpl.org";
var LOCALHOST_API_BASE_URL = "http://api.localhost:3000";
var CHAT_ENDPOINT = "/v1/chat";
var PROMPT_ENDPOINT = "/v1/chat";
var FEEDBACK_ENDPOINT = "/v1/feedback";
var BASE_URL =
  RUNTIME_LOCATION === "ripplex"
    ? DEV_XRPLAI_RIPPLEX_API_BASE_URL
    : LOCALHOST_API_BASE_URL;
var CHAT_API_URL = `${BASE_URL}${CHAT_ENDPOINT}`;
var PROMPT_API_URL = `${BASE_URL}${PROMPT_ENDPOINT}`;
var FEEDBACK_API_URL = `${BASE_URL}${FEEDBACK_ENDPOINT}`;

/** @type {import('@xrpl/ai-react').MarkpromptOptions} */
window.markprompt = {
  projectKey: DEV_XRPLAI_RIPPLEX_IO_PROJECT_KEY,
  defaultView: "prompt",
  options: {
    chat: {
      enabled: PROMPT_MODE === "chat",
      apiUrl: CHAT_API_URL,
    },
    feedback: {
      enabled: true,
      apiUrl: FEEDBACK_API_URL,
    },
    prompt: {
      apiUrl: PROMPT_API_URL,
      systemPrompt: `
You are a very enthusiastic company representative who loves to help people! Given the following sections from the documentation (preceded by a section id), answer the question using only that information, outputted in Markdown format. If you are unsure and the answer is not explicitly written in the documentation, say "{{I_DONT_KNOW}}".

Context sections:
---
{{CONTEXT}}

Question: "{{PROMPT}}"

Answer (including related code snippets if available and markdown links to relevant things):
        `.trim(),
    },
    references: {
      getHref: (reference) => {
        const { file } = reference;
        if (file && file.path) {
          // /\/content\/[^_][^/]*\.md/.test(file.path)
          if (
            file.path.includes("content/") &&
            !file.path.includes("content/_") &&
            file.path.endsWith(".md")
          ) {
            // Remove the extension if it's a regular content page that lives on xrpl.org
            // return file.path.replace(/\.[^.]+$/, '');
            // Change extension to html and remove content/ from the URL
            if (file.path.endsWith("ja.md")) {
              // Japanese lives at /ja/<filename>.html
              return `ja/${file.path
                .replace(/content\//, "")
                .replace(/\.ja\.md$/, ".html")}`;
            }
            return file.path.replace(/content\//, "").replace(/\.md$/, ".html");
          } else {
            // Otherwise link to a file on the github repo such as .js or README.md
            return `https://github.com/XRPLF/xrpl-dev-portal/blob/master/${file.path}`;
          }
        } else {
          // Handle the case where file or file.path is missing
          return "";
        }
      },
      getLabel: (reference) => {
        return reference.meta?.leadHeading?.value || reference.file?.title;
      },
    },
    showBranding: false,
    trigger: {
      floating: true,
    },
    search: {
      enabled: true,
      provider: {
        name: "algolia",
        apiKey: "3431349deec23b0bc3dcd3424beb9a6e",
        appId: "R39QY3MZC7",
        indexName: "xrpl",
      },
    },
  },
};
