import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

Given('I am logged in to Rudderstack', function() {
    const username = Cypress.env('RUDDERSTACK_USERNAME');
    const password = Cypress.env('RUDDERSTACK_PASSWORD');

    // Login in with credentials
    cy.login(username, password);

    // Validate Connection page is successfully displayed
    cy.contains('h3', 'Connections', { timeout: 20000 }).should('be.visible');
    cy.contains('Destinations', { timeout: 20000 }).should('be.visible');
    cy.contains('Sources', { timeout: 20000 }).should('be.visible');
});

When('I retrieve the data plane URL and the HTTP source write key', function() {
    cy.xpath("(//span[text()='Data Plane']/following::div/span)[1]")
        .invoke('text')
        .as('dataPlaneUrl');

    cy.contains('span', 'Write key')
        .invoke('text')
        .then((fullText) => {
            const writeKey = fullText.replace('Write key ', '');
            cy.wrap(writeKey).as('httpWriteKey');
        });
});

When('I navigate to the webhook events page and get the initial count', function() {
    // Click on Webhook
    cy.get('#destination-310qDIgEE1ekkG3RvOuYZCXA9Bw').click();

    // Click on event tab of the destination.
    cy.get('#rc-tabs-0-tab-Events', { timeout: 10000 }).should('be.visible').click();

    // Read the initial count of delivered event
    cy.xpath('(//span[text()="Delivered"]/following::div/h2)[1]/span', { timeout: 15000 })
        .invoke('text')
        .as('initialDeliveredCount');

    // Read the initial count of failed event
    cy.xpath('(//span[text()="Failed"]/following::div/h2)[1]/span')
        .invoke('text')
        .as('initialFailedCount');
});

When('I send a track event to the source via API', function() {

    const dataPlaneUrl = this.dataPlaneUrl;
    const httpWriteKey = this.httpWriteKey;

    const base64Key = btoa(`${httpWriteKey}:`);
    const requestBody = {
        userId: 'user123',
        event: 'Product Purchased',
        properties: { name: "Rubik's Cube", revenue: 4.99 },
        context: { ip: '14.5.67.21' },
        timestamp: new Date().toISOString(),
    };

    cy.request({
        method: 'POST',
        url: `${dataPlaneUrl}/v1/track`,
        body: requestBody,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${base64Key}`
        },
    }).its('status').should('eq', 200);
});

Then('the delivered event count should increase by one and failed event count should be zero', function() {
    // Wait for 70 sec due to reporting latency
    cy.wait(70000);

    // On the events page, click the refresh button to get the latest data
    cy.xpath("//span[text()='Refresh']").should('be.visible').click();

    // Custom command to validate the delivered count.
    cy.validateEventCount('Delivered', '@initialDeliveredCount', 1);

    // Custom command to validate the failed count.
    cy.validateEventCount('Failed', '@initialFailedCount', 0);
});