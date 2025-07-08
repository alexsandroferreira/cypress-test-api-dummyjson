/* eslint-disable no-unused-vars */

const {
  defineConfig
} = require("cypress");

module.exports = defineConfig({
  reporter: 'mochawesome',
  reporterOptions: {
    reportDir: 'cypress/reports',
    overwrite: false,
    html: false,
    json: true
  },
  e2e: {
    baseUrl: process.env.BASE_API_URL || 'https://dummyjson.com',
    setupNodeEvents(on, config) {
    }
  }
});