// Disable ESLint to prevent failing linting inside the Next.js repo.
// If you're using ESLint on your project, we recommend installing the ESLint Cypress plugin instead:
// https://github.com/cypress-io/eslint-plugin-cypress

// Cypress E2E Test
describe("Tasks", () => {
  it("should navigate to the Feedback page", () => {
    cy.getSession()

    // Start from the index page
    cy.visit("http://localhost:3000/feedback")

    // The new url should include
    cy.url().should("include", "/feedback")

    cy.get("textarea[name=good]", { timeout: 15000 }).type("abc123")
    cy.get("textarea[name=bad]", { timeout: 15000 }).type("abc123")
    cy.get("textarea[name=other]", { timeout: 15000 }).type("abc123")
  })
})

// Prevent TypeScript from reading file as legacy script
export { }
