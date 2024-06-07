// ***********************************************
// This example commands.js shows you how to
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
import "@testing-library/cypress/add-commands";

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace Cypress {
        interface Chainable {
            dataCy(value: string): Chainable<JQuery<HTMLElement>>;

            login(
                email?: string,
                password?: string
            ): void;

            logout(): void;
        }
    }
}

Cypress.Commands.add("dataCy", (value) => {
    return cy.get(`[data-cy=${value}]`);
});

Cypress.Commands.add("login", (email, password) => {
    cy.visit("/login");

    cy.dataCy("login-email").type(email ?? "test01@example.com");
    cy.dataCy("login-password").type(password ?? "password123");

    cy.get("form").submit();

    cy.get("form").should("not.exist");

    cy.visit("/login");
    cy.url().should("eq", "http://localhost:5173/");
});

Cypress.Commands.add("logout", () => {
    cy.dataCy("nav-menu-user").click();
    cy.contains("Logout").click();
    cy.contains("Logout").should("not.exist");
});
