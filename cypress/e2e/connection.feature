Feature: Rudderstack Event Validation

  This feature tests the complete flow of sending an event via the HTTP API and verifying its delivery to a Webhook destination.

  Scenario: Verify an API event is successfully delivered to a webhook destination
    Given I am logged in to Rudderstack
    When I retrieve the data plane URL and the HTTP source write key
    And I navigate to the webhook events page and get the initial count
    And I send a track event to the source via API
    Then the delivered event count should increase by one and failed event count should be zero
    