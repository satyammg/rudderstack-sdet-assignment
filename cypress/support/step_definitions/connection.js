import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

Given('I am logged in to Rudderstack', () => {
    // Use Cypress env variables to get credentials
    const username = Cypress.env('RUDDERSTACK_USERNAME');
    const password = Cypress.env('RUDDERSTACK_PASSWORD');

    //Login to website
    cy.login(username, password);

    //Validate Connection page is successfully displayed
    cy.xpath('//h3[text()="Connections"]', { timeout: 10000 }).should('be.visible');
    cy.contains('Destinations', { timeout: 10000 }).should('be.visible');
    cy.contains('Sources', { timeout: 10000 }).should('be.visible');
});


When('I retrieve the data plane URL and write key of the HTTP source', () => {

    //Read and Store data plane url
    cy.get('.dataplane-url-copy-cta')
        .siblings('span')
        .invoke('text')
        .as('dataPlaneUrl');

    cy.get('@dataPlaneUrl').then((url) => {
        cy.log(`The stored data plane URL is: ${url}`);
    });

    //Copy and store the write key of the HTTP Source
    cy.contains('span', 'Write key')
        .invoke('text')
        .then((fullText) => {
            const writeKey = fullText.replace('Write key ', '');
            cy.wrap(writeKey).as('httpWriteKey');
        });

    cy.get('@httpWriteKey').then((key) => {
        cy.log(`The stored write key is: ${key}`);
    });
});


When('I send an event to the HTTP source via API', () => {
    // Chain Cypress commands to ensure aliases are resolved before use.
    cy.get('@dataPlaneUrl').then((dataPlaneUrl) => {
        cy.get('@httpWriteKey').then((httpWriteKey) => {

            const base64Key = btoa(`${httpWriteKey}:`);

            const requestBody = {
                userId: 'user123',
                event: 'Product Purchased',
                properties: {
                    name: "Rubik's Cube",
                    revenue: 4.99,
                },
                context: {
                    ip: '14.5.67.21',
                },
                timestamp: '2020-02-02T00:23:09.544Z',
            };

            // Make the API call using cy.request()
            cy.request({
                method: 'POST',
                // Use the resolved variable correctly in the URL
                url: `${dataPlaneUrl}/v1/track`,
                body: requestBody,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${base64Key}`
                },
            }).then((response) => {
                // Assert that the request was successful
                expect(response.status).to.eq(200);
            });
        });
    });
});

Then('I should navigate to the Events tab', () => {

    //Click on Webhook
    cy.get('#destination-310qDIgEE1ekkG3RvOuYZCXA9Bw').click()

    //Click on event tab of the destination.
    cy.get('#rc-tabs-0-tab-Events', { timeout: 10000 }).should('be.visible').click()

});

Then('I should read the count of delivered and failed events', () => {

    cy.xpath('(//span[text()="Delivered"]/following::div/h2)[1]/span', { timeout: 15000 }).invoke('text').as('delivered');
    cy.get('@delivered').then((deliveredValue) => {
        cy.log(`Count of delivered is: ${deliveredValue}`);
    });

    cy.xpath('(//span[text()="Delivered"]/following::div/h2)[2]/span').invoke('text').as('failed');
    cy.get('@failed').then((failedValue) => {
        cy.log(`Count of failed is: ${failedValue}`);
    });
});