import {
  ActionIcon,
  Alert,
  Anchor,
  Badge,
  Button,
  Card,
  Divider,
  Group,
  Text,
  Timeline,
  Title,
  Tooltip,
} from '@mantine/core'
import { useEffect, useRef } from 'react'

import { explorerTxUrl } from '../config'
import type { RunnableStep, StepAction } from '../steps'
import type { StepResult } from '../types'
import { type PartyKey } from '../variables'
import { ActionConsole } from './ActionConsole'
import { JsonView } from './JsonView'
import { PARTY_COLOR, PartyBadge, partyInitials } from './PartyBadge'

export interface ActionSlot {
  result: StepResult | null
  error: string | null
}

type RowState = 'done' | 'running' | 'next' | 'locked'

/** Where to read about each mechanism the flow used, in the order it used it. */
const NEXT_READS: { label: string; href: string }[] = [
  {
    label: 'Multi-purpose tokens',
    href: 'https://xrpl.org/docs/concepts/tokens/fungible-tokens/multi-purpose-tokens',
  },
  {
    label: 'Confidential transfers',
    href: 'https://xrpl.org/docs/concepts/tokens/fungible-tokens/confidential-transfers',
  },
  {
    label: 'Batch transactions',
    href: 'https://xrpl.org/docs/concepts/transactions/batch-transactions',
  },
  {
    label: 'Sponsored fees and reserves',
    href: 'https://xrpl.org/docs/concepts/accounts/sponsored-fees-and-reserves',
  },
]

/** Transactions, notes, and artifacts produced by one completed action. */
function ActionResult({ result }: { result: StepResult }) {
  return (
    <div className="action-result" data-testid="action-result">
      {result.txs.map((tx) => (
        <div key={tx.hash}>
          <Group gap={8} wrap="nowrap" align="baseline">
            <Text size="sm" c="teal.8" fw={700} className="success-check">
              ✓
            </Text>
            <Text size="sm" style={{ flex: 1 }}>
              {tx.label}
              {tx.sponsored && (
                <Badge component="span" size="xs" variant="light" color="gray" ml={6}>
                  sponsored
                </Badge>
              )}
              {tx.inner && (
                <Badge component="span" size="xs" variant="light" color="blue" ml={6}>
                  inner tx
                </Badge>
              )}
            </Text>
            <Tooltip label="The engine result the validators recorded for this transaction.">
              <Badge size="xs" variant="light" color="teal" ff="monospace" tt="none">
                {tx.result}
              </Badge>
            </Tooltip>
            <Anchor
              href={explorerTxUrl(tx.hash)}
              target="_blank"
              rel="noreferrer"
              size="xs"
              ff="monospace"
              title={tx.hash}
            >
              {tx.hash.slice(0, 8)}…
            </Anchor>
          </Group>
          {tx.txJson != null && (
            <JsonView
              label="What the ledger recorded (validated transaction and metadata)"
              value={tx.txJson}
              ml={22}
            />
          )}
        </div>
      ))}
      {result.notes.map((note) => (
        <Text key={note} size="sm" c="dimmed">
          · {note}
        </Text>
      ))}
      {result.artifacts?.map((artifact) => (
        <JsonView key={artifact.label} label={artifact.label} value={artifact.json} />
      ))}
    </div>
  )
}

/** The ordered actions of one step, as a timeline the reader walks down. */
function ActionTimeline({
  step,
  slots,
  completedActions,
  isCurrent,
  runningAction,
  busy,
  preview,
  actor,
  onRunAction,
  onBecome,
}: {
  step: RunnableStep
  slots: ActionSlot[]
  completedActions: number
  isCurrent: boolean
  runningAction: number | null
  busy: boolean
  preview?: unknown
  actor: PartyKey | null
  onRunAction: (actionIndex: number) => void
  onBecome: (party: PartyKey) => void
}) {
  const consoleRef = useRef<HTMLDivElement>(null)
  const lastStepRef = useRef(step.id)

  // The console pulls itself into view when an action completes, because the
  // next one moves down the timeline as results accumulate above it. It must
  // not do so on arriving at a step: the console is taller than the narrative
  // above it, so revealing it would scroll the description the reader has yet
  // to read off the top. Arrival is the panel's job (it scrolls to the top).
  useEffect(() => {
    const arrived = lastStepRef.current !== step.id
    lastStepRef.current = step.id
    if (arrived) {
      return
    }
    consoleRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [step.id, completedActions, isCurrent])

  const rowState = (actionIndex: number): RowState =>
    actionIndex < completedActions
      ? 'done'
      : runningAction === actionIndex
        ? 'running'
        : isCurrent && actionIndex === completedActions
          ? 'next'
          : 'locked'

  const rowTitle = (action: StepAction, state: RowState) =>
    state === 'next' || state === 'running' ? undefined : (
      <Group gap={8} wrap="nowrap">
        {action.party && <PartyBadge party={action.party} size="xs" />}
        <Text size="sm" fw={500} c={state === 'locked' ? 'dimmed' : undefined}>
          {action.label}
        </Text>
        {state === 'done' && (
          <Badge size="xs" variant="light" color="teal">
            done
          </Badge>
        )}
      </Group>
    )

  return (
    <Timeline
      mt="md"
      active={completedActions - 1}
      bulletSize={26}
      lineWidth={2}
      color="teal"
      className="action-timeline"
    >
      {step.actions.map((action, actionIndex) => {
        const state = rowState(actionIndex)
        const color = action.party ? PARTY_COLOR[action.party] : 'teal'
        return (
          <Timeline.Item
            key={action.id}
            color={state === 'done' ? 'teal' : color}
            lineVariant={state === 'locked' ? 'dashed' : 'solid'}
            bullet={
              <span className={`t-bullet ${state}`}>
                {state === 'done' ? '✓' : partyInitials(action.party)}
              </span>
            }
            title={rowTitle(action, state)}
          >
            {state !== 'next' && state !== 'running' && (
              <Text size="xs" c="dimmed">
                {action.detail}
              </Text>
            )}
            {(state === 'next' || state === 'running') && (
              <div ref={consoleRef}>
                <ActionConsole
                  action={action}
                  running={state === 'running'}
                  error={slots[actionIndex].error}
                  busy={busy}
                  preview={preview}
                  canAct={action.party == null || actor === action.party}
                  onBecome={() => action.party && onBecome(action.party)}
                  onRun={() => onRunAction(actionIndex)}
                />
              </div>
            )}
            {slots[actionIndex].result && (
              <ActionResult result={slots[actionIndex].result} />
            )}
          </Timeline.Item>
        )
      })}
    </Timeline>
  )
}

/**
 * The end of the flow: says so, then hands the reader the specs behind what
 * they just ran. Brief by design — it replaces the continue footer, and the
 * back arrow above it still works, so nothing here closes the flow off.
 */
function CompletionView() {
  return (
    <>
      <Divider mt="md" />
      <Group justify="space-between" align="center" mt={12} gap="sm" wrap="wrap">
        <Text size="sm" c="teal.9" fw={600}>
          ✓ Repo settled. That's the whole lifecycle.
        </Text>
        <Group gap={4} wrap="wrap" justify="flex-end">
          <Text size="sm" fw={700} c="dimmed">
            Resources:
          </Text>
          {NEXT_READS.map((read, index) => (
            <Text size="sm" key={read.href}>
              {/* Blue, not the teal primary: teal carries state in this UI
                  (balances, completion), so links get their own color. */}
              <Anchor
                href={read.href}
                target="_blank"
                rel="noreferrer"
                c="blue.7"
                underline="always"
              >
                {read.label}
              </Anchor>
              {index < NEXT_READS.length - 1 && (
                <Text span c="dimmed">
                  {' · '}
                </Text>
              )}
            </Text>
          ))}
        </Group>
      </Group>
    </>
  )
}

/**
 * One step on one card, so the whole screen stays in view. The back and
 * forward arrows move through the steps horizontally; forward stops at the
 * live step, and revisited steps show their results read-only — an executed
 * action can never run twice. The active action expands into the acting
 * party's console, and completed actions keep their results inline, so cause
 * stays next to effect.
 */
export function StepPanel({
  step,
  eyebrow,
  slots,
  completedActions,
  isCurrent,
  runningAction,
  busy,
  preview,
  actor,
  canGoBack,
  canGoForward,
  onNavigate,
  continueLabel,
  onContinue,
  flowComplete,
  onRunAction,
  onBecome,
}: {
  step: RunnableStep
  eyebrow: string
  slots: ActionSlot[]
  completedActions: number
  /** Whether this step is the flow's frontier (actions may run). */
  isCurrent: boolean
  runningAction: number | null
  busy: boolean
  preview?: unknown
  /** The reader's selected identity; actions run only as the right party. */
  actor: PartyKey | null
  canGoBack: boolean
  canGoForward: boolean
  /** Move the viewed step by ±1, clamped to the unlocked range. */
  onNavigate: (delta: 1 | -1) => void
  continueLabel?: string
  onContinue: () => void
  /** Set on the last step once every action has run: the flow has no more. */
  flowComplete?: boolean
  onRunAction: (actionIndex: number) => void
  onBecome: (party: PartyKey) => void
}) {
  const bodyRef = useRef<HTMLDivElement>(null)

  // Arriving at a step starts it at its own beginning: the body is a scroll
  // region, so without this it keeps the previous step's offset and drops the
  // reader mid-narrative.
  useEffect(() => {
    if (bodyRef.current != null) {
      bodyRef.current.scrollTop = 0
    }
  }, [step.id])

  return (
    <Card
      withBorder
      shadow="sm"
      padding="md"
      aria-live="polite"
      className="step-card"
    >
      {/* The heading and the arrows stay put; the narrative below them scrolls,
          so the reader always knows which step they're in. */}
      <Group justify="space-between" align="flex-start" mb={4} wrap="nowrap">
        <div>
          <Text
            size="xs"
            fw={700}
            tt="uppercase"
            c="teal.8"
            lts="0.06em"
            data-testid="step-eyebrow"
          >
            {eyebrow}
          </Text>
          <Title order={2} size={22} mt={2}>
            {step.title}
          </Title>
        </div>
        <Group gap={6} wrap="nowrap">
          <ActionIcon
            variant="default"
            size="lg"
            aria-label="Previous step"
            data-testid="step-back"
            disabled={!canGoBack}
            onClick={() => onNavigate(-1)}
          >
            ←
          </ActionIcon>
          <ActionIcon
            variant="default"
            size="lg"
            aria-label="Next step"
            data-testid="step-forward"
            disabled={!canGoForward}
            onClick={() => onNavigate(1)}
          >
            →
          </ActionIcon>
        </Group>
      </Group>

      <div className="panel-scroll" ref={bodyRef}>
        {/* The prose is capped to a readable measure, while the timeline below
            it keeps the card's full width for transaction JSON. */}
        <div className="step-narrative">
          <Text size="sm" mt={6}>
            {step.description}
          </Text>

          {step.callout && (
            <Alert
              mt="sm"
              p="sm"
              color={step.callout.kind === 'warn' ? 'yellow' : 'blue'}
              title={step.callout.title}
            >
              <Text size="sm">{step.callout.text}</Text>
            </Alert>
          )}

          {/* Same Alert as the callout above it, so the two kinds of aside read
              as one family and differ only in color and heading. */}
          {step.learn && (
            <Alert mt="sm" p="sm" color="teal" title="What the XRP Ledger provides">
              <Text size="sm">{step.learn}</Text>
            </Alert>
          )}
        </div>

        <ActionTimeline
          step={step}
          slots={slots}
          completedActions={completedActions}
          isCurrent={isCurrent}
          runningAction={runningAction}
          busy={busy}
          preview={preview}
          actor={actor}
          onRunAction={onRunAction}
          onBecome={onBecome}
        />
      </div>

      {/* One footer for a finished step, whether it just ran or is being
          revisited: the state on the left, the way onward on the right. */}
      {continueLabel && (
        <>
          <Divider mt="md" />
          <Group justify="space-between" align="center" mt={12}>
            {isCurrent ? (
              <Text size="sm" c="teal.9" fw={600}>
                ✓ Complete.
              </Text>
            ) : (
              <Text size="sm" c="dimmed">
                These actions already ran and can't run again.
              </Text>
            )}
            <Button onClick={onContinue} rightSection="→" data-testid="step-continue">
              {continueLabel}
            </Button>
          </Group>
        </>
      )}
      {continueLabel == null && flowComplete && <CompletionView />}
    </Card>
  )
}
