// Disable ESLint to prevent failing linting inside the Next.js repo.
// If you're using ESLint on your project, we recommend installing the ESLint Cypress plugin instead:
// https://github.com/cypress-io/eslint-plugin-cypress

// Cypress E2E Test
describe("Quizzes", () => {
  it("should navigate to the Quizes page", () => {
    cy.getSession()

    // Start from the index page
    cy.visit("http://localhost:3000/quizzes")

    // The new url should include
    cy.url().should("include", "/quizzes")

    cy.get(".MuiTypography-h5").contains("JavaScript Quiz").click()

    // TODO; Add a "back" button in the quiz page
    // cy.get("button").contains("Back").click()
  })
})

// Prevent TypeScript from reading file as legacy script
export {}
