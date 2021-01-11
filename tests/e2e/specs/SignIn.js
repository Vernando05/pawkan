describe('login test', () => {
  it('Visits the app root url', () => {
    cy.visit('/')
    cy.contains(/account/i)
      .click()
    cy.contains(/sign in/i)
      .click()
    cy.contains
  })
})
