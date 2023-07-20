import { defineConfig } from "cypress"

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    defaultCommandTimeout: 15000
  },
  component: {
    devServer: {
      framework: "next",
      bundler: "webpack"
    }
  },
  // Settings
  env: {
    baseUrl: "http://localhost:3000",
    username: "qwe@qwe.qwe",
    password: "qwe@qwe.qwe"
  }
})
