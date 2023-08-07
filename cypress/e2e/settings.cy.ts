// Disable ESLint to prevent failing linting inside the Next.js repo.
// If you're using ESLint on your project, we recommend installing the ESLint Cypress plugin instead:
// https://github.com/cypress-io/eslint-plugin-cypress

// Cypress E2E Test
describe("Settings", () => {
  it("should navigate to the Settings page", () => {
    cy.getSession()

    // Start from the index page
    cy.visit("http://localhost:3000/settings")

    // The new url should include
    cy.url().should("include", "/settings")

    cy.get("input[name=old]", { timeout: 15000 }).type("abc123")
    cy.get("input[name=new]", { timeout: 15000 }).type("abc123")
    cy.get("input[name=confirm]", { timeout: 15000 }).type("abc123")

    /*
      The button is disabled if the password is the same as the old. but we dont want to change
      the users password at every test so this is fine
    */

    // eslint-disable-next-line cypress/no-force
    cy.get("button").contains("Update").click({ force: true })
  })
})

// Prevent TypeScript from reading file as legacy script
export {}
