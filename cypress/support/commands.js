/**
 * @description Custom command to handle user login and session management.
 * It navigates directly to the login page, fills credentials, and validates successful login.
 * The session is cached to speed up subsequent tests.
 * @param {string} username - The user's email.
 * @param {string} password - The user's password.
 */
Cypress.Commands.add('login', (username, password) => {
    // Cache the browser session using cy.session()
    cy.session([username, password], () => {
        cy.visit('https://app.rudderstack.com/login');

        cy.get('#text-input-email').type(username);
        cy.get('#text-input-password').type(password);
        cy.contains('button', 'Log in').click();

        //Handle post login connection page validation
        cy.contains('a', "I'll do this later", { timeout: 20000 }).click({ force: true });
        cy.contains('span', "Go to dashboard", { timeout: 20000 }).click({ force: true });
        cy.get('button[title="Close"]', { timeout: 20000 }).click({ force: true });
    }, {
        cacheAcrossSpecs: true
    });
    cy.visit('https://app.rudderstack.com/')
});


/**
 * @description Custom command to validate an event count on the webhook page.
 * @param {string} eventType - The type of event to check ('Delivered' or 'Failed').
 * @param {string} initialCountAlias - The alias storing the initial count text (e.g., '@initialDeliveredCount').
 * @param {number} expectedChange - The expected change in the count (e.g., 1 for an increase, 0 for no change).
 * @param {number} pollTimeout - The maximum time in ms to wait for the count to update.
 */
Cypress.Commands.add('validateEventCount', (eventType, initialCountAlias, expectedChange) => {
    cy.get(initialCountAlias).then((initialCountText) => {

        // Parse the initial count
        const initialCount = parseInt(initialCountText, 10);
        const expectedCount = initialCount + expectedChange;

        cy.log(`Validating ${eventType} count. Initial: ${initialCount}, Expected: ${expectedCount}`);

        // Parameterized based on the eventType.
        const countLocator = `(//span[text()="${eventType}"]/following::div/h2)[1]/span`;

        //Validate the count of delivered and failed events.
        cy.xpath(countLocator)
            .invoke('text')
            .then(parseInt)
            .should('eq', expectedCount);
    });
});
