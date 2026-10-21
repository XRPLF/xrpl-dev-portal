import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  css: {
    // An inline config stops Vite searching parent directories for one, so a
    // PostCSS config added at the repository root can never leak into this
    // app's build. (Inside xrpl-dev-portal the root config purged Mantine's
    // classes and needed packages the app doesn't install.)
    postcss: { plugins: [] }
  },
  optimizeDeps: {
    // Pre-bundle the CommonJS xrpl build, but leave the ESM wasm wrapper
    // untouched so its import.meta.url-relative wasm fetch keeps working in dev.
    include: ['xrpl'],
    exclude: ['@xrplf/mpt-crypto']
  }
})
