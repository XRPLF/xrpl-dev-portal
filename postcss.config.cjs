/**
 * PostCSS Configuration
 * 
 * Processes compiled Sass output through:
 * 1. PurgeCSS - Removes unused CSS selectors
 * 2. Autoprefixer - Adds vendor prefixes for browser compatibility
 * 3. cssnano - Minifies and optimizes CSS (production only)
 */

const purgecss = require('@fullhuman/postcss-purgecss').default;
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  plugins: [
    // Only run PurgeCSS in production or when explicitly enabled
    ...(isProduction || process.env.PURGECSS === 'true'
      ? [
          purgecss({
            // Scan all content files for class names
            content: [
              './**/*.tsx',
              './**/*.ts',
              './**/*.md',
              './**/*.yaml',
              './**/*.html',
              './static/js/**/*.js',
              './static/vendor/**/*.js',
              // Ignore node_modules except for specific libraries that inject classes
              '!./node_modules/**/*',
            ],
            
            // Default extractor - looks for class names in content
            defaultExtractor: content => {
              // Match all words, including those with dashes and numbers
              const broadMatches = content.match(/[^<>"'`\s]*[^<>"'`\s:]/g) || [];
              // Match class names in className="..." or class="..." 
              const classMatches = content.match(/(?:class|className)=["']([^"']*)["']/g) || [];
              const classes = classMatches.flatMap(match => {
                const m = match.match(/["']([^"']*)["']/);
                return m ? m[1].split(/\s+/) : [];
              });
              return [...broadMatches, ...classes];
            },

            // Safelist - classes that should never be removed
            safelist: {
              // Standard safelist - dynamic state classes
              standard: [
                'html',
                'body',
                'light',
                'dark',
                'show',
                'hide',
                'active',
                'disabled',
                'open',
                'collapsed',
                'collapsing',
                'lang-ja', // Japanese language class
                /^lang-/, // All language classes
                // Common Bootstrap utility patterns that should always be kept
                /^container/, // All container classes
                /^row$/, // Row class
                /^col-/, // Column classes
                /^g-/, // Gap utilities
                /^p-/, // Padding utilities
                /^m-/, // Margin utilities  
                /^px-/, /^py-/, /^pt-/, /^pb-/, /^ps-/, /^pe-/, // Directional padding
                /^mx-/, /^my-/, /^mt-/, /^mb-/, /^ms-/, /^me-/, // Directional margin
                /^d-/, // Display utilities
                /^flex-/, // Flexbox utilities
                /^justify-/, // Justify content
                /^align-/, // Align items
                /^w-/, // Width utilities
                /^h-/, // Height utilities
                /^text-/, // Text utilities
                /^bg-/, // Background utilities
                /^border/, // Border utilities
                /^rounded/, // Border radius
              ],
              
              // Deep safelist - MINIMAL - only truly dynamic components
              deep: [
                // Bootstrap JS components (only if actually used with JS)
                /dropdown-menu/,
                /dropdown-item/,
                /modal-backdrop/,
                /fade/,
                
                // Third-party libraries
                /cm-/,
                /CodeMirror/,
                /lottie/,
              ],

              // Greedy safelist - VERY MINIMAL
              greedy: [
                /data-theme/, // Theme switching
              ],
            },

            // Reject specific patterns - don't remove these even if not found
            rejected: [],
            
            // Variables - keep CSS custom properties
            variables: true,
            
            // Keyframes - keep animation keyframes
            keyframes: true,
            
            // Font-face rules
            fontFace: true,
          }),
        ]
      : []),

    // Autoprefixer - adds vendor prefixes
    autoprefixer({
      overrideBrowserslist: [
        '>0.2%',
        'not dead',
        'not op_mini all',
        'last 2 versions',
      ],
    }),

    // cssnano - minification (production only)
    ...(isProduction
      ? [
          cssnano({
            preset: [
              'default',
              {
                discardComments: {
                  removeAll: true,
                },
                normalizeWhitespace: true,
                colormin: true,
                minifySelectors: true,
              },
            ],
          }),
        ]
      : []),
  ],
};

