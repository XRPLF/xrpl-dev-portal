import '@mantine/core/styles.css'
import './styles.css'

import { MantineProvider, createTheme } from '@mantine/core'
import React from 'react'
import ReactDOM from 'react-dom/client'

import App from './App'

const theme = createTheme({
  primaryColor: 'teal',
  defaultRadius: 'md',
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  fontFamilyMonospace:
    'ui-monospace, "SF Mono", "JetBrains Mono", Menlo, monospace',
  headings: { fontWeight: '700' },
})

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <MantineProvider theme={theme}>
      <App />
    </MantineProvider>
  </React.StrictMode>,
)
