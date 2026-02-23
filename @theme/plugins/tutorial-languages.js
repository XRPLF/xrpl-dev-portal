// @ts-check

/**
 * Plugin to detect languages supported in tutorial pages by scanning for tab labels.
 * This creates shared data that maps tutorial paths to their supported languages.
 */
export function tutorialLanguages() {
  /** @type {import("@redocly/realm/dist/server/plugins/types").PluginInstance } */
  const instance = {
    processContent: async (actions, { fs, cache }) => {
      try {
        /** @type {Record<string, string[]>} */
        const tutorialLanguagesMap = {}
        const allFiles = await fs.scan()

        // Find all markdown files in tutorials directory
        const tutorialFiles = allFiles.filter((file) =>
          file.relativePath.match(/^docs[\/\\]tutorials[\/\\].*\.md$/)
        )

        for (const { relativePath } of tutorialFiles) {
          try {
            const { data } = await cache.load(relativePath, 'markdown-ast')
            const languages = extractLanguagesFromAst(data.ast)

            if (languages.length > 0) {
              // Convert file path to URL path
              const urlPath = '/' + relativePath
                .replace(/\.md$/, '/')
                .replace(/\\/g, '/')
              tutorialLanguagesMap[urlPath] = languages
            }
          } catch (err) {
            continue // Skip files that can't be parsed.
          }
        }

        actions.createSharedData('tutorial-languages', tutorialLanguagesMap)
        actions.addRouteSharedData('/docs/tutorials/', 'tutorial-languages', 'tutorial-languages')
        actions.addRouteSharedData('/ja/docs/tutorials/', 'tutorial-languages', 'tutorial-languages')
        actions.addRouteSharedData('/es-es/docs/tutorials/', 'tutorial-languages', 'tutorial-languages')
      } catch (e) {
        console.log('[tutorial-languages] Error:', e)
      }
    },
  }
  return instance
}

/**
 * Extract language names from tab labels in the markdown AST
 */
function extractLanguagesFromAst(ast) {
  const languages = new Set()

  visit(ast, (node) => {
    // Look for tab nodes with a label attribute
    if (isNode(node) && node.type === 'tag' && node.tag === 'tab') {
      const label = node.attributes?.label
      if (label) {
        const normalizedLang = normalizeLanguage(label)
        if (normalizedLang) {
          languages.add(normalizedLang)
        }
      }
    }
  })

  return Array.from(languages)
}

/**
 * Convert tab labels like "JavaScript", "Python", etc. to lowercase keys
 * used for displaying the correct language icons on tutorial cards.
 */
function normalizeLanguage(label) {
  const labelLower = label.toLowerCase()

  if (labelLower.includes('javascript') || labelLower === 'js') {
    return 'javascript'
  }
  if (labelLower.includes('python') || labelLower === 'py') {
    return 'python'
  }
  if (labelLower.includes('java') && !labelLower.includes('javascript')) {
    return 'java'
  }
  if (labelLower.includes('php')) {
    return 'php'
  }
  if (labelLower.includes('go') || labelLower === 'golang') {
    return 'go'
  }
  if (labelLower.includes('http') || labelLower.includes('websocket')) {
    return 'http'
  }

  return null
}

function isNode(value) {
  return !!(value?.$$mdtype === 'Node')
}

function visit(node, visitor) {
  if (!node) return

  visitor(node)

  if (node.children) {
    for (const child of node.children) {
      if (!child || typeof child === 'string') {
        continue
      }
      visit(child, visitor)
    }
  }
}
