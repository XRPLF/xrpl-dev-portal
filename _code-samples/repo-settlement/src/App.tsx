import {
  Badge,
  Button,
  Container,
  Grid,
  Group,
  Stack,
  Stepper,
  Text,
  Title
} from '@mantine/core'
import { useCallback, useMemo, useRef, useState } from 'react'

import { BalancePanel } from './components/BalancePanel'
import { DealTicket } from './components/DealTicket'
import { StepPanel, type ActionSlot } from './components/StepPanel'
import { CONFIG } from './config'
import { buildSteps } from './steps'
import { RepoLedger, type BalanceSnapshot } from './repo'
import { DEFAULT_DEAL, type DealTerms, type PartyKey } from './variables'

export interface Identity {
  address: string
  publicKey: string
}

export type IdentityBook = Partial<Record<PartyKey, Identity>>

export default function App () {
  const ledgerRef = useRef<RepoLedger | null>(null)
  const getLedger = (): RepoLedger => {
    ledgerRef.current ??= new RepoLedger()
    return ledgerRef.current
  }

  const [deal, setDeal] = useState<DealTerms>(DEFAULT_DEAL)
  // Step and action counts don't depend on the terms, so progress state stays
  // valid when the deal changes (which is only possible before any progress).
  const steps = useMemo(() => buildSteps(deal), [deal])

  const [slots, setSlots] = useState<ActionSlot[][]>(() =>
    steps.map((step) => step.actions.map(() => ({ result: null, error: null })))
  )
  /** Completed-action count per step. */
  const [progress, setProgress] = useState<number[]>(() => steps.map(() => 0))
  /** The step the panel shows: one step per screen, arrows move between them. */
  const [selected, setSelected] = useState(0)
  const [running, setRunning] = useState<{ step: number, action: number } | null>(
    null
  )
  /** The reader's current identity: gates actions and decryption. */
  const [actor, setActor] = useState<PartyKey | null>(null)
  const [balances, setBalances] = useState<BalanceSnapshot | null>(null)
  const [identities, setIdentities] = useState<IdentityBook>({})

  const currentStep = progress.findIndex(
    (count, index) => count < steps[index].actions.length
  )
  const flowDone = currentStep === -1
  /** The terms are only editable until the first transaction is signed. */
  const dealLocked = progress.some((count) => count > 0) || running != null

  const nextAction = flowDone
    ? undefined
    : steps[currentStep].actions[progress[currentStep]]
  /** Whose move is next: highlights that party in the balances panel. */
  const turnParty = flowDone ? null : (nextAction?.party ?? null)

  const patchSlot = (
    stepIndex: number,
    actionIndex: number,
    value: Partial<ActionSlot>
  ): void => {
    setSlots((prev) =>
      prev.map((step, s) =>
        s === stepIndex
          ? step.map((slot, a) => (a === actionIndex ? { ...slot, ...value } : slot))
          : step
      )
    )
  }

  const runAction = useCallback(
    async (stepIndex: number, actionIndex: number): Promise<boolean> => {
      const ledger = getLedger()
      const action = steps[stepIndex].actions[actionIndex]

      setRunning({ step: stepIndex, action: actionIndex })
      patchSlot(stepIndex, actionIndex, { error: null })
      try {
        const result = await action.execute(ledger)
        patchSlot(stepIndex, actionIndex, { result, error: null })
        setIdentities(
          Object.fromEntries(
            Object.entries(ledger.parties).map(([key, party]) => [
              key,
              {
                address: party.wallet.address,
                publicKey: party.confidentialKeys.publicKey
              }
            ])
          ) as IdentityBook
        )
        setBalances(await ledger.snapshotBalances())
        setProgress((prev) =>
          prev.map((count, s) => (s === stepIndex ? actionIndex + 1 : count))
        )
        return true
      } catch (error) {
        patchSlot(stepIndex, actionIndex, {
          error: error instanceof Error ? error.message : String(error)
        })
        return false
      } finally {
        setRunning(null)
      }
    },
    [steps]
  )

  let preview: unknown
  if (nextAction?.preview != null && ledgerRef.current != null) {
    try {
      preview = nextAction.preview(ledgerRef.current)
    } catch {
      preview = undefined
    }
  }

  // Consecutive steps sharing a phase name become one stepper entry, so the
  // stepper stays short however many steps the flow has.
  const phases = useMemo(() => {
    const grouped: Array<{ name: string, steps: number[] }> = []
    steps.forEach((step, index) => {
      const last = grouped.at(-1)
      if (last?.name === step.phase) {
        last.steps.push(index)
      } else {
        grouped.push({ name: step.phase, steps: [index] })
      }
    })
    return grouped
  }, [steps])

  const step = steps[selected]
  /** The furthest step the reader may navigate to: the live one, never beyond. */
  const maxStep = flowDone ? steps.length - 1 : currentStep
  const live = selected === currentStep
  const currentPhase = flowDone
    ? phases.length - 1
    : phases.findIndex((p) => p.steps.includes(currentStep))
  const selectedPhase = phases.findIndex((p) => p.steps.includes(selected))

  // The step's place in its phase, not in the whole flow: a count in the teens
  // reads as a chore. Single-step phases say nothing, since the phase name
  // beside it is the whole count.
  const phaseSteps = phases[selectedPhase].steps
  const eyebrow =
    phaseSteps.length > 1
      ? `${step.phase} · Step ${phaseSteps.indexOf(selected) + 1} of ${phaseSteps.length}`
      : step.phase

  /**
   * Where clicking a phase lands. The phase holding the frontier lands on the
   * frontier itself, so it is the "back to where I was" target; every earlier
   * phase lands on its own first step.
   */
  const phaseTarget = (index: number): number =>
    phases[index].steps.includes(maxStep) ? maxStep : phases[index].steps[0]

  const dotState = (index: number): 'done' | 'live' | 'locked' => {
    if (progress[index] >= steps[index].actions.length) {
      return 'done'
    }
    return index <= maxStep ? 'live' : 'locked'
  }

  const stepComplete = progress[selected] >= step.actions.length
  const nextStep = steps[selected + 1]
  const continueLabel =
    stepComplete && nextStep != null && selected < maxStep
      ? `Next: ${nextStep.title}`
      : undefined

  return (
    // The inline gutter is left to .app-shell, which scales it with the window
    // instead of holding it at Container's fixed md.
    <Container size={1560} py='md' className='app-shell'>
      {/* The ticket sits beside the title rather than under it, so the chrome
          is as tall as the taller of the two rather than their sum. */}
      <div className='chrome'>
        <Group align='flex-start' mb='sm' gap='md' wrap='wrap'>
          <Stack gap={4} style={{ flex: '1 1 380px', minWidth: 0 }}>
            <Text size='xs' fw={700} tt='uppercase' c='teal.8' lts='0.08em'>
              XRP Ledger · interactive demo
            </Text>
            <Title order={1} size={24}>
              Confidential Atomic Settlement
            </Title>
            {/* Always shown, because becoming a party by clicking it is the
                demo's one non-obvious interaction. */}
            <Text size='sm' c='dimmed' maw={640}>
              A two-leg repo trade, settled atomically with encrypted amounts.
              You act as every party: click one in the balances panel to become
              it. Set the terms, sign each transaction, and decrypt only what
              your keys allow.
            </Text>
          </Stack>
          <Stack gap={6} style={{ flex: '0 1 560px', minWidth: 0 }}>
            <Group gap='sm' wrap='nowrap' justify='flex-end'>
              <Badge
                variant='light'
                color='gray'
                size='md'
                ff='monospace'
                fw={500}
                visibleFrom='sm'
              >
                {new URL(CONFIG.wssUrl).host}
              </Badge>
              <Button
                variant='default'
                size='xs'
                onClick={() => window.location.reload()}
              >
                Reset demo
              </Button>
            </Group>
            <DealTicket deal={deal} onChange={setDeal} locked={dealLocked} />
          </Stack>
        </Group>

        <Stepper
          active={flowDone ? phases.length : currentPhase}
          onStepClick={(index) => setSelected(phaseTarget(index))}
          size='xs'
          iconSize={24}
          color='teal'
          mt='sm'
          className='phase-stepper'
        >
          {/* completedIcon keeps the number on a finished phase, which Mantine
              would otherwise replace with a tick. The filled circle already
              says "done". */}
          {phases.map((item, index) => (
            <Stepper.Step
              key={item.name}
              label={item.name}
              allowStepSelect={item.steps[0] <= maxStep}
              completedIcon={index + 1}
              description={
                <span className='step-dots' aria-hidden>
                  {item.steps.map((stepIndex) => (
                    <span
                      key={stepIndex}
                      className='step-dot'
                      data-step-dot={stepIndex}
                      data-state={dotState(stepIndex)}
                      data-viewing={stepIndex === selected || undefined}
                      title={steps[stepIndex].title}
                      onClick={(event) => {
                        // The phase button would otherwise handle it and land
                        // on the phase's own target instead of this step.
                        event.stopPropagation()
                        if (stepIndex <= maxStep) {
                          setSelected(stepIndex)
                        }
                      }}
                    />
                  ))}
                </span>
              }
            />
          ))}
        </Stepper>
      </div>

      {/* Both panels take whatever height the chrome above them leaves and
          scroll their own overflow, so the page itself never scrolls. */}
      <Grid
        gap='md'
        mt='sm'
        className='panel-row'
        classNames={{ inner: 'panel-row-inner' }}
      >
        {/* The ledger gets a wider share at the md breakpoint, where a party's
            balances would otherwise be clipped; the step panel takes it back on
            a wide display, where the transaction JSON needs it. */}
        <Grid.Col span={{ base: 12, md: 7, lg: 7.5 }} className='panel-col'>
          <StepPanel
            step={step}
            eyebrow={eyebrow}
            slots={slots[selected]}
            completedActions={progress[selected]}
            isCurrent={live}
            runningAction={running?.step === selected ? running.action : null}
            busy={running != null}
            preview={live ? preview : undefined}
            actor={actor}
            canGoBack={selected > 0}
            canGoForward={selected < maxStep}
            onNavigate={(delta) =>
              setSelected((index) =>
                Math.min(Math.max(index + delta, 0), maxStep)
              )}
            continueLabel={continueLabel}
            onContinue={() => setSelected(selected + 1)}
            flowComplete={flowDone && selected === steps.length - 1}
            onRunAction={(action) => void runAction(selected, action)}
            onBecome={setActor}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 5, lg: 4.5 }} className='panel-col'>
          <BalancePanel
            balances={balances}
            identities={identities}
            turnParty={turnParty}
            viewer={actor}
            onSelect={setActor}
          />
        </Grid.Col>
      </Grid>
    </Container>
  )
}
