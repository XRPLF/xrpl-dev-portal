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
  Tooltip
} from '@mantine/core'
import { useEffect, useRef, useState } from 'react'

import { explorerTxUrl } from '../config'
import type { RunnableStep, StepAction } from '../steps'
import type { StepCallout, StepResult } from '../types'
import { type PartyKey } from '../variables'
import { ActionConsole } from './ActionConsole'
import { CalloutIcon } from './CalloutIcon'
import { JsonView } from './JsonView'
import { PartyBadge, partyColor, partyInitials, partyVars } from './PartyBadge'

export interface ActionSlot {
  result: StepResult | null
  error: string | null
}

type RowState = 'done' | 'running' | 'next' | 'locked'

/**
 * Where to read about each mechanism the flow used, in the order it used it.
 * Each label is the exact title of the page it links to.
 */
const NEXT_READS: Array<{ label: string, href: string }> = [
  {
    label: 'Multi-Purpose Tokens (MPTs)',
    href: 'https://xrpl.org/docs/concepts/tokens/fungible-tokens/multi-purpose-tokens'
  },
  {
    label: 'Confidential Transfers',
    href: 'https://xrpl.org/docs/concepts/tokens/fungible-tokens/confidential-transfers'
  },
  {
    label: 'Batch Transactions',
    href: 'https://xrpl.org/docs/concepts/transactions/batch-transactions'
  },
  {
    label: 'Sponsored Fees and Reserves',
    href: 'https://xrpl.org/docs/concepts/accounts/sponsored-fees-and-reserves'
  }
]

/** A step's callouts as a list, whether it declared one or several. */
function calloutList (callout: RunnableStep['callout']): StepCallout[] {
  if (callout == null) {
    return []
  }
  return Array.isArray(callout) ? callout : [callout]
}

function ActionResult ({ result }: { result: StepResult }) {
  return (
    <div className='action-result'>
      {result.txs.map((tx) => (
        <div key={tx.hash}>
          <Group gap={8} wrap='nowrap' align='baseline'>
            <Text size='sm' fw={700} className='accent-text success-check'>
              ✓
            </Text>
            <Text size='sm' style={{ flex: 1 }}>
              {tx.label}
              {/* Grey, like the orchestrator that paid for it. */}
              {tx.sponsored && (
                <Badge
                  component='span'
                  size='xs'
                  variant='light'
                  color='gray'
                  className='badge-gray'
                  ml={6}
                >
                  sponsored
                </Badge>
              )}
              {/* Grey too: blue would read as StableCorp. */}
              {tx.inner && (
                <Badge
                  component='span'
                  size='xs'
                  variant='light'
                  color='gray'
                  className='badge-gray'
                  ml={6}
                >
                  inner tx
                </Badge>
              )}
            </Text>
            <Tooltip label='The engine result the validators recorded for this transaction.'>
              <Badge
                size='xs'
                variant='light'
                color='teal'
                className='badge-teal'
                ff='monospace'
                tt='none'
              >
                {tx.result}
              </Badge>
            </Tooltip>
            <Anchor
              href={explorerTxUrl(tx.hash)}
              target='_blank'
              rel='noreferrer'
              size='xs'
              ff='monospace'
              className='tx-link'
              title={tx.hash}
            >
              {tx.hash.slice(0, 8)}…
            </Anchor>
          </Group>
          {tx.txJson != null && (
            <JsonView
              label='What the ledger recorded (validated transaction and metadata)'
              value={tx.txJson}
              ml={22}
            />
          )}
        </div>
      ))}
      {result.notes.map((note) => (
        <Text key={note} size='sm' c='dimmed'>
          · {note}
        </Text>
      ))}
      {result.artifacts?.map((artifact) => (
        <JsonView key={artifact.label} label={artifact.label} value={artifact.json} />
      ))}
    </div>
  )
}

function ActionTimeline ({
  step,
  slots,
  completedActions,
  isCurrent,
  runningAction,
  busy,
  preview,
  actor,
  onRunAction,
  onBecome
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
  // next one moves down the timeline as results accumulate above it. Not on
  // arrival at a step, where it would scroll the unread narrative off the top.
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
    state === 'next' || state === 'running'
      ? undefined
      : (
        <Group gap={8} wrap='nowrap'>
          {action.party && <PartyBadge party={action.party} size='xs' />}
          <Text size='sm' fw={500} c={state === 'locked' ? 'dimmed' : undefined}>
            {action.label}
          </Text>
          {state === 'done' && (
            <Badge size='xs' variant='light' color='teal' className='badge-teal'>
              done
            </Badge>
          )}
        </Group>
        )

  return (
    <Timeline
      mt='md'
      active={completedActions - 1}
      bulletSize={26}
      lineWidth={2}
      color='teal'
      className='action-timeline'
    >
      {step.actions.map((action, actionIndex) => {
        const state = rowState(actionIndex)
        const color = partyColor(action.party)
        return (
          <Timeline.Item
            key={action.id}
            color={state === 'done' ? 'teal' : color}
            lineVariant={state === 'locked' ? 'dashed' : 'solid'}
            bullet={
              <span
                className={`t-bullet ${state}`}
                style={partyVars(action.party)}
              >
                {state === 'done' ? '✓' : partyInitials(action.party)}
              </span>
            }
            title={rowTitle(action, state)}
          >
            {state !== 'next' && state !== 'running' && (
              <Text size='xs' c='dimmed'>
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
            {(slots[actionIndex].result != null) && (
              <ActionResult result={slots[actionIndex].result} />
            )}
          </Timeline.Item>
        )
      })}
    </Timeline>
  )
}

/** The end of the flow: says so, then links the mechanisms it used. */
function CompletionView () {
  return (
    <>
      <Divider mt='md' />
      <Group justify='space-between' align='center' mt={12} gap='sm' wrap='wrap'>
        <Text size='sm' className='accent-text' fw={600}>
          ✓ Swap settled. That's the whole lifecycle.
        </Text>
        <Group gap={4} wrap='wrap' justify='flex-end'>
          <Text size='sm' fw={700} c='dimmed'>
            Resources:
          </Text>
          {NEXT_READS.map((read, index) => (
            <Text size='sm' key={read.href}>
              {/* Blue, not the green primary: green carries state in this
                  UI (balances, completion), so links get their own color. */}
              <Anchor
                href={read.href}
                target='_blank'
                rel='noreferrer'
                c='blue'
                underline='always'
              >
                {read.label}
              </Anchor>
              {index < NEXT_READS.length - 1 && (
                <Text span c='dimmed'>
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
 * One step on one card, so the whole screen stays in view. Forward navigation
 * stops at the live step, and revisited steps show their results read-only: an
 * executed action can never run twice.
 */
export function StepPanel ({
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
  onBecome
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
  /** Whether the body has content below its fold, which draws a fade. */
  const [more, setMore] = useState(false)

  // The body is a scroll region, so without this a new step keeps the previous
  // one's offset and starts the reader mid-narrative.
  useEffect(() => {
    if (bodyRef.current != null) {
      bodyRef.current.scrollTop = 0
    }
  }, [step.id])

  // The fade at the bottom of the body only shows while something is below
  // the fold: it follows scrolling and any change in the body's content.
  useEffect(() => {
    const body = bodyRef.current
    if (body == null) {
      return
    }
    const update = (): void => {
      setMore(body.scrollHeight - body.scrollTop - body.clientHeight > 4)
    }
    update()
    body.addEventListener('scroll', update, { passive: true })
    const observer = new ResizeObserver(update)
    observer.observe(body)
    Array.from(body.children).forEach((child) => observer.observe(child))
    return () => {
      body.removeEventListener('scroll', update)
      observer.disconnect()
    }
  }, [step.id, completedActions, runningAction])

  return (
    <Card
      withBorder
      shadow='sm'
      padding='md'
      aria-live='polite'
      className='step-card'
    >
      {/* Outside the scroll region below, so the step's identity stays put. */}
      <Group
        justify='space-between'
        align='flex-start'
        wrap='nowrap'
        className='step-head'
      >
        <div>
          <Text className='eyebrow'>{eyebrow}</Text>
          <Title order={2} className='step-title' mt={4}>
            {step.title}
          </Title>
        </div>
        <Group gap={6} wrap='nowrap'>
          <ActionIcon
            variant='default'
            size='lg'
            aria-label='Previous step'
            disabled={!canGoBack}
            onClick={() => onNavigate(-1)}
          >
            ←
          </ActionIcon>
          <ActionIcon
            variant='default'
            size='lg'
            aria-label='Next step'
            disabled={!canGoForward}
            onClick={() => onNavigate(1)}
          >
            →
          </ActionIcon>
        </Group>
      </Group>

      <div className={`scroll-frame ${more ? 'has-more' : ''}`}>
      <div className='panel-scroll' ref={bodyRef}>
        {/* The prose is capped to a readable measure, while the timeline below
            it keeps the card's full width for transaction JSON. */}
        <div className='step-narrative'>
          <Text size='sm' mt={6}>
            {step.description}
          </Text>

          {/* Coloured and iconed as xrpl.org's admonitions: a note is blue,
              a caution yellow, a tip green. */}
          {calloutList(step.callout).map((callout) => (
            <Alert
              key={callout.title}
              mt='sm'
              p='sm'
              color={callout.kind === 'warn' ? 'yellow' : 'blue'}
              className={`callout callout-${callout.kind === 'warn' ? 'warn' : 'note'}`}
              icon={<CalloutIcon kind={callout.kind === 'warn' ? 'warn' : 'note'} />}
              title={callout.title}
            >
              <Text size='sm'>{callout.text}</Text>
            </Alert>
          ))}

          {step.learn && (
            <Alert
              mt='sm'
              p='sm'
              color='teal'
              className='callout callout-tip'
              icon={<CalloutIcon kind='tip' />}
              title={step.learnTitle}
            >
              <Text size='sm'>{step.learn}</Text>
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
      </div>

      {/* One footer for a finished step, whether it just ran or is revisited. */}
      {continueLabel && (
        <>
          <Divider mt='md' />
          <Group justify='space-between' align='center' mt={12}>
            {isCurrent
              ? (
                <Text size='sm' className='accent-text' fw={600}>
                  ✓ Complete.
                </Text>
                )
              : (
                <Text size='sm' c='dimmed'>
                  These actions already ran and can't run again.
                </Text>
                )}
            <Button onClick={onContinue} rightSection='→'>
              {continueLabel}
            </Button>
          </Group>
        </>
      )}
      {continueLabel == null && flowComplete && <CompletionView />}
    </Card>
  )
}
