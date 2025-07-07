import js from "@eslint/js";
import json from "@eslint/json";
import globals from "globals";
import { defineConfig } from "eslint/config";
import cypressPlugin from "eslint-plugin-cypress";

export default defineConfig([
  // JavaScript padrão
  {
    files: ["**/*.{js,mjs,cjs}"],
    plugins: { js },
    extends: ["js/recommended"]
  },

  // Globals de node/browser
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      }
    }
  },

  // JSON
  {
    files: ["**/*.json"],
    plugins: { json },
    language: "json/json",
    extends: ["json/recommended"]
  },

  // Cypress
  {
    files: ["cypress/**/*.js", "cypress/**/*.cy.js"],
    plugins: { cypress: cypressPlugin },
    extends: ["plugin:cypress/recommended"],
    languageOptions: {
      globals: {
        ...globals.mocha,       // describe, it, beforeEach, etc.
        ...globals.browser,     // window, document
        Cypress: "readonly",    // variável Cypress
        cy: "readonly"          // comandos Cypress
      }
    }
  }
]);
