// Disable ESLint to prevent failing linting inside the Next.js repo.
// If you're using ESLint on your project, we recommend installing the ESLint Cypress plugin instead:
// https://github.com/cypress-io/eslint-plugin-cypress

// Cypress E2E Test
describe("Profile", () => {
  it("should navigate to the Profile page", () => {
    cy.getSession()

    // Start from the index page
    cy.visit("http://localhost:3000/profile")

    // The new url should include
    cy.url().should("include", "/profile")

    cy.get("textarea[name=about]", { timeout: 15000 }).type("The quick brown fox jumps over the lazy dog")

    cy.get("button").contains("Update information").click()
  })
})

// Prevent TypeScript from reading file as legacy script
export {}
