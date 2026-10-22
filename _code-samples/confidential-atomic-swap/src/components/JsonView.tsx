import { Paper, ScrollArea, Text, type PaperProps } from '@mantine/core'
import type { ReactNode } from 'react'

/**
 * Serialize a transaction exactly as it goes to the ledger. Nothing is
 * shortened, renamed, or decoded, since the long hex of Zero-Knowledge Proofs
 * and ciphertexts is part of what is signed. The only change is `bigint` to
 * string, which JSON cannot represent otherwise.
 */
function replacer (_key: string, value: unknown): unknown {
  return typeof value === 'bigint' ? value.toString() : value
}

/* One token at a time: a string (and whether a colon follows, making it a
   key), a literal, or a number. Anything between tokens is punctuation and
   whitespace, which keeps the exact layout of the serialized text. */
const TOKEN =
  /("(?:\\.|[^"\\])*")(\s*:)?|\b(true|false|null)\b|(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)/g

/** The serialized text with keys, strings, and numbers in their own colours,
    so the shape of a long payload can be read at a glance. */
function highlight (text: string): ReactNode[] {
  const out: ReactNode[] = []
  let last = 0
  let i = 0
  for (const match of text.matchAll(TOKEN)) {
    const index = match.index ?? 0
    if (index > last) {
      out.push(text.slice(last, index))
    }
    const [, str, colon, literal, num] = match
    if (str != null) {
      out.push(
        <span key={i++} className={colon != null ? 'j-key' : 'j-str'}>
          {str}
        </span>
      )
      if (colon != null) {
        out.push(colon)
      }
    } else if (literal != null) {
      out.push(<span key={i++} className='j-lit'>{literal}</span>)
    } else if (num != null) {
      out.push(<span key={i++} className='j-num'>{num}</span>)
    }
    last = index + match[0].length
  }
  if (last < text.length) {
    out.push(text.slice(last))
  }
  return out
}

export function JsonView ({
  label,
  value,
  defaultOpen = false,
  ...paperProps
}: {
  label: string
  value: unknown
  defaultOpen?: boolean
} & PaperProps) {
  return (
    <Paper
      component='details'
      withBorder
      mt={6}
      open={defaultOpen}
      className='json-view'
      style={{ overflow: 'hidden' }}
      {...paperProps}
    >
      <Text
        component='summary'
        size='xs'
        fw={500}
        px={12}
        py={7}
        style={{ cursor: 'pointer', userSelect: 'none' }}
      >
        {label}
      </Text>
      {/* Payloads carry full proofs and ciphertexts, so an open one would
          otherwise be taller than the card that holds it. */}
      <ScrollArea.Autosize mah={220}>
        <pre className='json-pre'>{highlight(JSON.stringify(value, replacer, 2))}</pre>
      </ScrollArea.Autosize>
    </Paper>
  )
}
