import { Code, Paper, ScrollArea, Text, type PaperProps } from '@mantine/core'

/**
 * Serialize a transaction exactly as it goes to the ledger. Nothing is
 * shortened, renamed, or decoded: the long hex of zero-knowledge proofs and
 * ciphertexts is part of what is being signed, so it is shown in full. The
 * only change is `bigint` to string, which JSON cannot represent otherwise.
 */
function replacer(_key: string, value: unknown): unknown {
  return typeof value === 'bigint' ? value.toString() : value
}

export function JsonView({
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
      component="details"
      withBorder
      radius="md"
      mt={6}
      open={defaultOpen}
      style={{ overflow: 'hidden' }}
      {...paperProps}
    >
      <Text
        component="summary"
        size="xs"
        fw={600}
        px={12}
        py={7}
        bg="gray.0"
        style={{ cursor: 'pointer', userSelect: 'none' }}
      >
        {label}
      </Text>
      {/* Payloads carry full proofs and ciphertexts, so an open one would
          otherwise be taller than the card that holds it: it scrolls itself. */}
      <ScrollArea.Autosize mah={220}>
        <Code block fz={12} style={{ overflowWrap: 'anywhere' }}>
          {JSON.stringify(value, replacer, 2)}
        </Code>
      </ScrollArea.Autosize>
    </Paper>
  )
}
