/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
Cypress.Commands.add("getSession", () => {
  const { username, password } = Cypress.env()
  cy.login(username, password)
})
Cypress.Commands.add("login", (username, password) => {
  cy.session([username, password], () => {
    cy.visit("http://localhost:3000/")

    // Find a button with class and contains text
    cy.get(".MuiButton-root").contains("Sign in").click()

    // The new url should include
    cy.url().should("include", "/login")

    cy.get("input[name=email]", { timeout: 15000 }).type(username)
    cy.get("input[name=email]").should("have.value", username)

    cy.get("input[name=password]").type(password)
    cy.get("input[name=password]").should("have.value", password)

    cy.get(".MuiButton-root").contains("Sign in Now").click()

    cy.url({ timeout: 15000 }).should("include", "/home")

    cy.intercept("/api/quizresults").as("quizresults")
    cy.intercept("/api/events").as("events")
    cy.intercept("/api/courses").as("courses")
    cy.intercept("/api/projects").as("projects")
    cy.intercept("/api/tasks").as("tasks")
    cy.wait(["@quizresults", "@events", "@courses", "@projects", "@tasks"], { responseTimeout: 15000 })
  })
})
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      // eslint-disable-next-line @typescript-eslint/method-signature-style
      getSession(): Chainable<void>
      // eslint-disable-next-line @typescript-eslint/method-signature-style
      login(email: string, password: string): Chainable<void>
    //   drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
    //   dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
    //   visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
    }
  }
}

// Prevent TypeScript from reading file as legacy script
export { }
