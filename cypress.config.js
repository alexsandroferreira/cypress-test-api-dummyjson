/* eslint-disable no-unused-vars */ 
 
const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl:  process.env.BASE_API_URL || 'https://dummyjson.com',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
