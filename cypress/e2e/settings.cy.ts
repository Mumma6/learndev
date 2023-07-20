// Disable ESLint to prevent failing linting inside the Next.js repo.
// If you're using ESLint on your project, we recommend installing the ESLint Cypress plugin instead:
// https://github.com/cypress-io/eslint-plugin-cypress

// Cypress E2E Test
describe("Tasks", () => {
  it("should navigate to the Settings page", () => {
    cy.getSession()

    // Start from the index page
    cy.visit("http://localhost:3000/settings")

    // The new url should include
    cy.url().should("include", "/settings")

    cy.get("input[name=old]", { timeout: 15000 }).type("abc123")
    cy.get("input[name=new]", { timeout: 15000 }).type("abc123")
    cy.get("input[name=confirm]", { timeout: 15000 }).type("abc123")

    cy.get("button").contains("Update information").click()
  })
})

// Prevent TypeScript from reading file as legacy script
export { }
