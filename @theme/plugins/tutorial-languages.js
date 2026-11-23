// @ts-check
// Languages per tutorial page, read on the tutorials landing page as
// `usePageSharedData('tutorial-languages')`.
//
// Detection methods (in priority order):
// 1. Tab labels in the markdown (for multi-language tutorials)
// 2. Filename patterns like "-js.md", "-py.md" (for single-language tutorials)
// 3. Title containing language name (for single-language tutorials)

import { createEntityLoader } from '@redocly/framework/plugin'

import { attachTo } from './blog-posts.js'
import { isNode, visit } from './markdoc-text.js'

const SHARED_DATA_KEY = 'tutorial-languages'
const ROUTES = ['/docs/tutorials', '/ja/docs/tutorials', '/es-es/docs/tutorials']

export const tutorialLanguagesLoader = createEntityLoader('xrpl:tutorial-languages', async (ctx) => {
  /** @type {Record<string, string[]>} */
  const languagesByUrl = {}
  for (const { path, key } of ctx.args.tutorials) {
    const { languages } = await ctx.entities.load(key)
    if (languages.length > 0) {
      languagesByUrl['/' + path.replace(/\.md$/, '/')] = languages
    }
  }
  return { value: languagesByUrl }
})

/** `tutorials`: the tutorial files and the keys of their per-file entities. */
export function tutorialLanguages(ctx, tutorials) {
  const ref = tutorialLanguagesLoader.withArgs(
    { tutorials: tutorials.map(({ path, key }) => ({ path, key })) },
    { stableKey: 'xrpl:tutorial-languages' },
  )
  return { entities: [ref], attach: attachTo(ctx, ROUTES, SHARED_DATA_KEY, ref) }
}

/**
 * Extract language names from tab labels in the markdown AST
 */
export function extractLanguagesFromAst(ast) {
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

  if (labelLower.includes('typescript') || labelLower === 'ts') {
    return 'typescript'
  }
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
export function detectLanguageFromPathAndTitle(relativePath, title) {
  const pathLower = relativePath.toLowerCase()
  const titleLower = (title || '').toLowerCase()

  // Check filename suffixes like "-js.md", "-py.md"
  if (pathLower.endsWith('-ts.md') || pathLower.includes('-typescript.md') || pathLower.includes('-in-typescript.md')) {
    return 'typescript'
  }
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
  if (titleLower.includes('typescript') || titleLower.includes(' ts ') || titleLower.endsWith(' ts')) {
    return 'typescript'
  }
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
