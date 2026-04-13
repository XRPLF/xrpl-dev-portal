// @ts-check

import { getInnerText } from '@redocly/realm/dist/markdoc/helpers/get-inner-text.js'

/**
 * Plugin to detect languages supported in tutorial pages.
 *
 * Detection methods (in priority order):
 * 1. Tab labels in the markdown (for multi-language tutorials)
 * 2. Filename patterns like "-js.md", "-py.md" (for single-language tutorials)
 * 3. Title containing language name (for single-language tutorials)
 *
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

            // Try to detect languages from tab labels first
            let languages = extractLanguagesFromAst(data.ast)

            // Fallback: detect language from filename/title for single-language tutorials
            if (languages.length === 0) {
              const title = extractFirstHeading(data.ast) || ''
              const fallbackLang = detectLanguageFromPathAndTitle(relativePath, title)
              if (fallbackLang) {
                languages = [fallbackLang]
              }
            }

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
    if (!isNode(node)) return

    // Detect languages from tab labels
    if (node.type === 'tag' && node.tag === 'tab') {
      const label = node.attributes?.label
      if (label) {
        const normalized = normalizeLanguage(label)
        if (normalized) languages.add(normalized)
      }
    }

    // Detect languages from code-snippet language attributes
    if (node.type === 'tag' && node.tag === 'code-snippet') {
      const lang = node.attributes?.language
      if (lang) {
        const normalized = normalizeLanguage(lang)
        if (normalized) languages.add(normalized)
      }
    }

    // Detect languages from fenced code blocks (```js, ```python, etc.)
    if (node.type === 'fence' && node.attributes?.language) {
      const normalized = normalizeLanguage(node.attributes.language)
      if (normalized) languages.add(normalized)
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

/**
 * Detect language from file path and title for single-language tutorials.
 * This is a fallback when no tab labels are found in the markdown.
 */
function detectLanguageFromPathAndTitle(relativePath, title) {
  const pathLower = relativePath.toLowerCase()
  const titleLower = (title || '').toLowerCase()

  // Check filename suffixes like "-js.md", "-py.md"
  if (pathLower.endsWith('-js.md') || pathLower.includes('-javascript.md') || pathLower.includes('-in-javascript.md')) {
    return 'javascript'
  }
  if (pathLower.endsWith('-py.md') || pathLower.includes('-python.md') || pathLower.includes('-in-python.md')) {
    return 'python'
  }
  if (pathLower.endsWith('-java.md') || pathLower.includes('-in-java.md')) {
    return 'java'
  }
  if (pathLower.endsWith('-go.md') || pathLower.includes('-in-go.md') || pathLower.includes('-golang.md')) {
    return 'go'
  }
  if (pathLower.endsWith('-php.md') || pathLower.includes('-in-php.md')) {
    return 'php'
  }

  // Check title for language indicators
  if (titleLower.includes('javascript') || titleLower.includes(' js ') || titleLower.endsWith(' js')) {
    return 'javascript'
  }
  if (titleLower.includes('python')) {
    return 'python'
  }
  if (titleLower.includes('java') && !titleLower.includes('javascript')) {
    return 'java'
  }
  if (titleLower.includes('golang') || (titleLower.includes(' go ') || titleLower.endsWith(' go') || titleLower.includes('using go'))) {
    return 'go'
  }
  if (titleLower.includes('php')) {
    return 'php'
  }

  return null
}

const EXIT = Symbol('Exit visitor')

/**
 * Extract the first heading from the markdown AST
 */
function extractFirstHeading(ast) {
  let heading = null

  visit(ast, (node) => {
    if (!isNode(node)) return
    if (node.type === 'heading') {
      heading = getInnerText([node])
      return EXIT
    }
  })

  return heading
}

function isNode(value) {
  return !!(value?.$$mdtype === 'Node')
}

function visit(node, visitor) {
  if (!node) return

  const res = visitor(node)
  if (res === EXIT) return res

  if (node.children) {
    for (const child of node.children) {
      if (!child || typeof child === 'string') {
        continue
      }
      const res = visit(child, visitor)
      if (res === EXIT) return res
    }
  }
}
