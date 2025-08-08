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

Cypress.Commands.add('login', (username, password) => {
    // cy.session() will cache the browser session.
    // The code inside will only run the first time it's called in a test run.
    // Subsequent calls will restore the session from cache, skipping the UI login.
    cy.session([username, password], () => {
        cy.visit('https://app.rudderstack.com/');

        // Use more resilient selectors instead of XPath
        cy.get('#text-input-email').type(username);
        cy.get('#text-input-password').type(password);
        cy.contains('button', 'Log in').click();

        // It's better to handle these popups within the login flow
        // so the test itself doesn't have to worry about them.
        cy.contains('a', "I'll do this later", { timeout: 10000 }).click();
        cy.contains('span', "Go to dashboard", { timeout: 10000 }).click();
        cy.get('button[title="Close"]', { timeout: 10000 }).click();

        //Url Assertion to validate successful login
        cy.url().should('not.include', '/login');
    }, {
        cacheAcrossSpecs: true
    }
    );
    cy.visit('https://app.rudderstack.com/')
});
