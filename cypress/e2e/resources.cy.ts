// Disable ESLint to prevent failing linting inside the Next.js repo.
// If you're using ESLint on your project, we recommend installing the ESLint Cypress plugin instead:
// https://github.com/cypress-io/eslint-plugin-cypress

// Cypress E2E Test
describe("Tasks", () => {
  it("should navigate to the Resources page", () => {
    cy.getSession()

    // Start from the index page
    cy.visit("http://localhost:3000/resources")

    // The new url should include
    cy.url().should("include", "/resources")

    cy.get("button").contains("Add resources").click()

    cy.get("button").contains("Cancel").click()
  })
})

// Prevent TypeScript from reading file as legacy script
export { }
