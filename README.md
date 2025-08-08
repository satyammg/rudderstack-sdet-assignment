# RudderStack Automation

This project contains end-to-end tests for RudderStack using Cypress with Cucumber integration.

## Prerequisites

Before running the tests, make sure you have:

- Node.js (latest LTS version recommended)
- npm (comes with Node.js)
- A RudderStack account with valid credentials

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd rudderstack-automation
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory with the following content:
```env
QA_USERNAME=your_rudderstack_username
QA_PASSWORD=your_rudderstack_password
```

## Project Structure

```
├── cypress/
│   ├── e2e/                    # Feature files
│   │   └── connection.feature
│   ├── fixtures/              # Test data
│   │   └── example.json
│   └── support/              # Support files and step definitions
│       ├── commands.js       # Custom commands
│       ├── e2e.js           # e2e configuration
│       └── step_definitions/
│           └── connection.js # Step definitions for features
├── cypress.config.js         # Cypress configuration
└── package.json
```

## Running Tests

To open Cypress Test Runner:
```bash
npx cypress open
```

To run tests in headless mode:
```bash
npx cypress run
```

## Technology Stack

- [Cypress](https://www.cypress.io/) - Modern web testing framework
- [Cucumber](https://cucumber.io/) - BDD testing framework
- [@badeball/cypress-cucumber-preprocessor](https://github.com/badeball/cypress-cucumber-preprocessor) - Cucumber preprocessor for Cypress
- [cypress-xpath](https://github.com/cypress-io/cypress-xpath) - XPath support for Cypress

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


## Author

Created by Satyam Singh
