Feature: Rudderstack Event Validation  
  As a user, I want to verify that events sent to an HTTP source are delivered to the webhook destination correctly.

  Scenario: A new event sent to an HTTP source is delivered to a webhook destination  
    Given I am logged in to Rudderstack  
    When I retrieve the data plane URL and write key of the HTTP source
    And I send an event to the HTTP source via API 
    Then I should navigate to the Events tab  
    And I should read the count of delivered and failed events
