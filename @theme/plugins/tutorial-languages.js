// @ts-check

/**
 * Detect the programming languages a tutorial has code for. Used by the
 * tutorial-metadata plugin for the language icons and filter on the
 * tutorials landing page.
 *
 * Detection, in priority order:
 * 1. Code tabs, code snippets and fenced code blocks in the page (multi-language tutorials)
 * 2. Filename suffixes such as "-js.md" or "-in-python.md" (single-language tutorials)
 * 3. A language name in the title (single-language tutorials)
 *
 * @param {import('@markdoc/markdoc').Node} ast Markdoc AST of the tutorial
 * @param {string} relativePath Content-relative path of the tutorial file
 * @param {string} title Title of the tutorial
 * @returns {string[]} Language keys such as "javascript" or "python", empty when none was detected
 */
export function detectTutorialLanguages(ast, relativePath, title) {
  const fromCode = languagesFromCode(ast)
  if (fromCode.length > 0) return fromCode

  const fallback = languageFromPath(relativePath) || languageFromTitle(title)
  return fallback ? [fallback] : []
}

/** Languages named by code tabs, code-snippet tags and fenced code blocks */
function languagesFromCode(ast) {
  const languages = new Set()

  visit(ast, (node) => {
    let label = null
    if (node.type === 'tag' && node.tag === 'tab') label = node.attributes?.label
    if (node.type === 'tag' && node.tag === 'code-snippet') label = node.attributes?.language
    if (node.type === 'fence') label = node.attributes?.language

    const language = label && normalizeLanguage(label)
    if (language) languages.add(language)
  })

  return Array.from(languages)
}

/** Map a tab label or code-block language such as "JavaScript" or "py" to a language key */
function normalizeLanguage(label) {
  const lower = label.toLowerCase()

  // Labels are language names, so substring matches are enough; order matters where one name contains another
  if (lower.includes('typescript') || lower === 'ts') return 'typescript'
  if (lower.includes('javascript') || lower === 'js') return 'javascript'
  if (lower.includes('python') || lower === 'py') return 'python'
  if (lower.includes('java')) return 'java'
  if (lower.includes('php')) return 'php'
  if (lower.includes('go')) return 'go'
  if (lower.includes('http') || lower.includes('websocket')) return 'http'

  return null
}

/** Language from filename suffixes such as "-js.md", "-python.md" or "-in-go.md" */
function languageFromPath(relativePath) {
  const name = relativePath.toLowerCase().replace(/\.md$/, '')

  if (/-(ts|typescript|in-typescript)$/.test(name)) return 'typescript'
  if (/-(js|javascript|in-javascript)$/.test(name)) return 'javascript'
  if (/-(py|python|in-python)$/.test(name)) return 'python'
  if (/-(java|in-java)$/.test(name)) return 'java'
  if (/-(go|golang|in-go)$/.test(name)) return 'go'
  if (/-(php|in-php)$/.test(name)) return 'php'

  return null
}

/** Language named in the title, such as "Build a Desktop Wallet in Python" */
function languageFromTitle(title) {
  const lower = ` ${(title || '').toLowerCase()} `

  // Same substring rule and ordering as normalizeLanguage; the title is padded
  // with spaces so " js " also matches at the start or end
  if (lower.includes('typescript') || lower.includes(' ts ')) return 'typescript'
  if (lower.includes('javascript') || lower.includes(' js ')) return 'javascript'
  if (lower.includes('python')) return 'python'
  if (lower.includes('java')) return 'java'
  if (lower.includes('golang') || lower.includes(' go ')) return 'go'
  if (lower.includes('php')) return 'php'
  if (lower.includes('http') || lower.includes('websocket')) return 'http'

  return null
}

/** Call visitor on every Markdoc node in the tree, depth first */
function visit(node, visitor) {
  if (node?.$$mdtype !== 'Node') return
  visitor(node)
  for (const child of node.children ?? []) visit(child, visitor)
}
