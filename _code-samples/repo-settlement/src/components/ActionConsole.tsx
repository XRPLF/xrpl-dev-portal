import { Alert, Avatar, Button, Group, Loader, Text } from '@mantine/core'

import type { StepAction } from '../steps'
import { PARTIES } from '../variables'
import { JsonView } from './JsonView'
import { partyColor, partyVars } from './PartyBadge'

function actorName(action: StepAction): string {
  return action.party ? PARTIES[action.party].name : 'Demo setup'
}

function actorInitials(action: StepAction): string {
  if (!action.party) {
    return '⚙'
  }
  return (PARTIES[action.party].name.match(/[A-Z]/gu) ?? []).slice(0, 2).join('')
}

/**
 * The one place where things happen: themed in the acting party's color, it
 * shows who you are, the exact transaction you're about to sign, and the
 * button that does it.
 */
export function ActionConsole({
  action,
  running,
  error,
  busy,
  preview,
  canAct,
  onBecome,
  onRun,
}: {
  action: StepAction
  running: boolean
  error: string | null
  busy: boolean
  preview?: unknown
  /** Whether the reader's selected identity may sign this action. */
  canAct: boolean
  onBecome: () => void
  onRun: () => void
}) {
  const color = partyColor(action.party)

  return (
    <div className="action-console" style={partyVars(action.party)}>
      <Group justify="space-between" align="center" wrap="nowrap" gap="md">
        <Group gap="md" wrap="nowrap">
          <Avatar size={44} radius="xl" color={color} variant="filled" fz={15} fw={700}>
            {actorInitials(action)}
          </Avatar>
          <div>
            <Text size="xs" fw={700} tt="uppercase" lts="0.06em" className="your-move">
              <span className="pointer" aria-hidden>
                ➤
              </span>{' '}
              Your move · {actorName(action)}
              {action.party && (
                <Text span size="xs" c="dimmed" fw={500} tt="none" ml={6}>
                  {PARTIES[action.party].roleLabel}
                </Text>
              )}
            </Text>
            <Text size="md" fw={600} mt={2}>
              {action.label}
            </Text>
            <Text size="sm" c="dimmed" mt={2}>
              {action.detail}
            </Text>
            {!canAct && !running && (
              <Text size="xs" fw={600} mt={4} className="your-move">
                Only {actorName(action)} holds the key to sign this. Switch
                identity to act.
              </Text>
            )}
          </div>
        </Group>
        {running ? (
          <Group gap={8} wrap="nowrap">
            <Loader size="sm" color={color} />
            <Text size="sm" c="dimmed">
              On ledger…
            </Text>
          </Group>
        ) : !canAct ? (
          <Button
            size="md"
            variant="light"
            color={color}
            onClick={onBecome}
            disabled={busy}
            style={{ flexShrink: 0 }}
          >
            Act as {actorName(action)} →
          </Button>
        ) : (
          <Button
            size="md"
            color={color}
            onClick={onRun}
            disabled={busy}
            style={{ flexShrink: 0 }}
          >
            {error != null ? 'Retry' : action.cta}
          </Button>
        )}
      </Group>

      {preview != null && !running && (
        <>
          <JsonView
            label={
              action.previewCaveat == null
                ? 'Exactly what will be submitted'
                : 'What will be submitted (incomplete — see below)'
            }
            value={preview}
            defaultOpen
            mt={10}
            bg="white"
          />
          {action.previewCaveat != null && (
            <Text size="xs" c="dimmed" mt={6}>
              {action.previewCaveat}
            </Text>
          )}
        </>
      )}
      {error != null && (
        <Alert color="red" title="Action failed" mt="sm" p="sm" data-testid="action-error">
          <Text size="xs" ff="monospace" style={{ overflowWrap: 'anywhere' }}>
            {error}
          </Text>
        </Alert>
      )}
    </div>
  )
}
