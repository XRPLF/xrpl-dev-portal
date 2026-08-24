/**
 * UI behavior that needs no ledger: identity selection through the balances
 * panel, the deal ticket's live math and collapse, step navigation locking,
 * and the pinned layout. The live-transaction path is covered by
 * devnet-flow.cy.ts.
 */
describe('repo settlement UI', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('selects the acting identity by clicking a party in the balances panel', () => {
    // The old top actor bar is gone; the balances panel is the only switch.
    cy.contains('You are:').should('not.exist')

    // All five parties are listed before any account exists.
    cy.get('[data-party]').should('have.length', 5)
    cy.contains('No account yet').should('exist')

    cy.get('[data-party="investCo"]').click()
    cy.get('[data-party="investCo"]').contains('you').should('be.visible')

    // Selecting another party moves the badge.
    cy.get('[data-party="tradeDesk"]').click()
    cy.get('[data-party="tradeDesk"]').contains('you').should('be.visible')
    cy.get('[data-party="investCo"]').contains('you').should('not.exist')
  })

  it('recomputes the deal math live and collapses to a summary', () => {
    // Collapsed by default: the summary stands in for the inputs, so the flow
    // takes the screen until the reader chooses to edit the terms.
    cy.get('[data-testid="deal-summary"]')
      .should('be.visible')
      .and('contain', '100 tMMF')
      .and('contain', '1,001.37 USD')

    cy.get('[data-testid="deal-toggle"]').click()
    cy.get('[data-testid="deal-summary"]').should('not.exist')

    // Default terms: 1,000.00 × 5% × 10/365 = 1.37 USD.
    cy.get('[data-testid="interest-math"]').should('contain', '1.37 USD')

    cy.contains('label', 'Repo rate (% p.a.)')
      .invoke('attr', 'for')
      .then((id) => cy.get(`#${id}`).type('{selectall}10'))
    cy.get('[data-testid="interest-math"]').should('contain', '2.74 USD')

    // Collapsing again folds the edited terms back into the same one line.
    cy.get('[data-testid="deal-toggle"]').click()
    cy.get('[data-testid="deal-summary"]')
      .should('be.visible')
      .and('contain', '1,002.74 USD')
  })

  it('locks navigation to the live step until it is executed', () => {
    // Setup is a one-step phase, so the eyebrow is the phase name alone: a
    // count of one says nothing the name doesn't already say.
    cy.get('[data-testid="step-eyebrow"]').should('have.text', 'Setup')
    cy.contains('Fund the five accounts').should('be.visible')

    // Nothing has run: no going back from step 1, no skipping ahead.
    cy.get('[data-testid="step-back"]').should('be.disabled')
    cy.get('[data-testid="step-forward"]').should('be.disabled')

    // Future phases in the stepper are not selectable either.
    cy.contains('button', 'Far leg').click({ force: true })
    cy.get('[data-testid="step-eyebrow"]').should('have.text', 'Setup')

    // One dot per step, and the unreached ones don't navigate.
    cy.get('[data-step-dot]').should('have.length', 19)
    cy.get('[data-step-dot="0"]').should('have.attr', 'data-state', 'live')
    cy.get('[data-step-dot="0"]').should('have.attr', 'data-viewing')
    cy.get('[data-step-dot="6"]').should('have.attr', 'data-state', 'locked')
    cy.get('[data-step-dot="6"]').click({ force: true })
    cy.get('[data-testid="step-eyebrow"]').should('have.text', 'Setup')
  })

  it('holds both cards at one height, capped on a tall display', () => {
    // A tall widescreen has far more height than the first step needs, so the
    // pair is capped rather than stretched into two mostly-empty columns. Both
    // cards are the same height, and that height doesn't depend on either
    // one's content: the balances panel must not move as the step changes.
    cy.viewport(1728, 1080)

    cy.get('.step-card').then(([step]) => {
      cy.get('.ledger-card').then(([ledger]) => {
        expect(step.clientHeight).to.eq(ledger.clientHeight)
        expect(step.clientHeight).to.be.at.most(760)
      })
    })

    // Still pinned: the extra height stays empty rather than scrolling.
    cy.document().then((doc) => {
      expect(doc.documentElement.scrollHeight).to.eq(
        doc.documentElement.clientHeight,
      )
    })
  })

  it('pins the page and scrolls inside each card', () => {
    // Short enough to overflow, but still wide enough to stay side-by-side:
    // the stacked layout below 62em scrolls the shell instead, by design.
    cy.viewport(1200, 500)

    // The document itself must not scroll: overflow belongs to the cards.
    cy.document().then((doc) => {
      expect(doc.documentElement.scrollHeight).to.eq(
        doc.documentElement.clientHeight,
      )
    })

    // The card is bounded by the viewport, so its body is a live scroll
    // region. This breaks if the flex chain down to .panel-scroll is severed:
    // the card grows to fit its content and nothing scrolls at all.
    cy.get('.step-card .panel-scroll').then(([body]) => {
      expect(body.scrollHeight).to.be.greaterThan(body.clientHeight)
    })

    cy.get('.step-card .panel-scroll').scrollTo('bottom')
    cy.get('.step-card .panel-scroll').should(([body]) => {
      expect(body.scrollTop).to.be.greaterThan(0)
    })
  })

  it('shows all five parties without scrolling the balances panel', () => {
    // The narrowest side-by-side width, and the shortest common laptop height:
    // the whole point of the compact rows is that the reader never has to
    // scroll the balances to see who holds what.
    cy.viewport(1024, 768)

    cy.get('.ledger-card .panel-scroll').should(([body]) => {
      expect(body.scrollHeight).to.be.at.most(body.clientHeight)
    })

    // Nor may a row be clipped sideways into its own horizontal scroll.
    cy.get('.ledger-card .panel-scroll').should(([body]) => {
      expect(body.scrollWidth).to.be.at.most(body.clientWidth)
    })
  })
})
