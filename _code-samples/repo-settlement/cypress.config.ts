import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    supportFile: 'cypress/support/e2e.ts',
    video: false,
    // Mantine transitions and the WASM crypto bundle make first paint slow.
    defaultCommandTimeout: 10_000,
  },
})
