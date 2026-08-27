/**
 * The live-transaction path, against the real Devnet: funding, the lock and
 * collapse of the deal ticket, the success animation with the recorded
 * transaction result, and step navigation once progress exists.
 *
 * Slow and network-dependent, so it only runs when asked:
 * `npm run test:e2e:devnet` (or `cypress run --env devnet=1`).
 */
const LEDGER_TIMEOUT = 180_000

const describeDevnet = Cypress.env('devnet') ? describe : describe.skip

describeDevnet('repo settlement on Devnet', () => {
  it('funds the accounts, then unlocks navigation and shows results', () => {
    cy.visit('/')

    // Step 1 is the faucet; no party owns it, so it runs without an identity.
    cy.contains('button', 'Fund').click()
    cy.get('[data-testid="action-result"]', { timeout: LEDGER_TIMEOUT })
      .should('contain', 'InvestCo')

    // The first signature froze and collapsed the deal ticket.
    cy.contains('Terms locked').should('be.visible')
    cy.get('[data-testid="deal-summary"]').should('be.visible')

    // Every party now has a funded account with a visible address.
    cy.get('[data-party="investCo"]').contains('XRP').should('exist')
    cy.get('[data-party="investCo"] .party-address').should('contain', 'r')

    // Whoever moves next is flagged in the balances panel: AlphaFund issues.
    cy.get('[data-party="alphaFund"]').contains('next').should('be.visible')

    // Completing the step opens the way forward, by button or arrow.
    cy.get('[data-testid="step-forward"]').should('be.enabled')
    cy.get('[data-testid="step-continue"]').should('contain', 'Next:').click()
    // The eyebrow counts within the phase, so Issue's first step reads 1 of 3.
    cy.get('[data-testid="step-eyebrow"]').should(
      'have.text',
      'Issue · Step 1 of 3',
    )

    // Going back shows the executed step read-only, and the same footer button
    // leads forward again.
    cy.get('[data-testid="step-back"]').click()
    cy.get('[data-testid="step-eyebrow"]').should('have.text', 'Setup')
    cy.contains('already ran').should('be.visible')
    cy.contains('button', 'Fund').should('not.exist')
    cy.get('[data-testid="step-continue"]').click()
    cy.get('[data-testid="step-eyebrow"]').should(
      'have.text',
      'Issue · Step 1 of 3',
    )

    // Only AlphaFund's key can sign this; clicking its row makes you AlphaFund.
    // The console sits below the narrative, which resets to the top on each
    // step, so scroll to it as a reader would before asserting.
    cy.contains('button', 'Act as AlphaFund')
      .scrollIntoView()
      .should('be.visible')
    cy.get('[data-party="alphaFund"]').click()
    cy.get('[data-party="alphaFund"]').contains('you').should('be.visible')

    // Run the issuance and check the recorded transaction result appears.
    cy.contains('button', 'Create').click()
    cy.get('[data-testid="action-result"]', { timeout: LEDGER_TIMEOUT })
      .should('contain', 'tesSUCCESS')
    cy.contains('What the ledger recorded').should('exist')
  })
})
