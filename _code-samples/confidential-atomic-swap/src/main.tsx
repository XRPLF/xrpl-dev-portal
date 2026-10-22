import '@mantine/core/styles.css'
import './styles.css'

import {
  MantineProvider,
  createTheme,
  type MantineColorsTuple
} from '@mantine/core'
import React from 'react'
import ReactDOM from 'react-dom/client'

import { initAnalytics } from './analytics'
import App from './App'

initAnalytics()

/* Dark mode uses xrpl.org's grays (styles/_colors.scss in xrpl-dev-portal):
   Mantine reads index 7 as the page and 6 as a card, so the page is the
   portal's gray-900 #141414 and a card its gray-800 #232325. Light mode is
   untouched: Mantine's own palette, as the demo first shipped. */
const xrplDark: MantineColorsTuple = [
  '#E6EAF0', '#CAD4DF', '#8A919A', '#72777E', '#343437',
  '#2A2A2D', '#232325', '#141414', '#111111', '#000000'
]

const theme = createTheme({
  primaryColor: 'teal',
  /* Fills use the same shade in both schemes. Mantine's dark default is two
     steps darker, which made a party's avatar and button a deeper colour than
     its marker on the timeline and its pill in the ledger. */
  primaryShade: { light: 6, dark: 6 },
  /* Two columns from 864px rather than Mantine's 992px: a laptop window that
     isn't full-screen still gets the ledger beside the step instead of under
     it. The stacked layout's media query in styles.css uses the same width. */
  breakpoints: { xs: '36em', sm: '48em', md: '54em', lg: '75em', xl: '88em' },
  colors: { dark: xrplDark },
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  fontFamilyMonospace:
    'ui-monospace, "SF Mono", "JetBrains Mono", Menlo, monospace',
  headings: { fontWeight: '700' },
  // Soft, generous corners on surfaces; pills for every control.
  defaultRadius: 'md',
  radius: { xs: '6px', sm: '10px', md: '14px', lg: '16px', xl: '9999px' },
  components: {
    Button: { defaultProps: { radius: 'xl' } },
    ActionIcon: { defaultProps: { radius: 'xl' } },
    Badge: { defaultProps: { radius: 'xl' } },
    Card: { defaultProps: { shadow: 'none', radius: 'lg' } },
    Tooltip: { defaultProps: { radius: 'sm' } }
  }
})

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <MantineProvider theme={theme} defaultColorScheme='auto'>
      <App />
    </MantineProvider>
  </React.StrictMode>
)
