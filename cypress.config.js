const { defineConfig } = require("cypress");
const createBundler = require("@bahmutov/cypress-esbuild-preprocessor");
const { addCucumberPreprocessorPlugin } = require("@badeball/cypress-cucumber-preprocessor");
const { createEsbuildPlugin } = require("@badeball/cypress-cucumber-preprocessor/esbuild");
require('dotenv').config()

module.exports = defineConfig({
  e2e: {
    env: {
      RUDDERSTACK_USERNAME: process.env.QA_USERNAME, 
      RUDDERSTACK_PASSWORD: process.env.QA_PASSWORD,
    },
    specPattern: "**/*.feature", 
    async setupNodeEvents(on, config) {
      await addCucumberPreprocessorPlugin(on, config);
      on(
        "file:preprocessor",
        createBundler({
          plugins: [createEsbuildPlugin(config)],
        })
      );
      return config;
    },
  },
});