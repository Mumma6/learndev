import { defineConfig } from "cypress"

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000"
  },
  component: {
    devServer: {
      framework: "next",
      bundler: "webpack"
    }
  }
  // ToDo: Figure out settings...
//   defaultCommandTimeout: 15000
})
