const serverless = require("serverless-http")
const app = require("./app.js")
console.warn(`Starting on: ${process.env.NETLIFY ? "Production" : "Development"}`)
exports.handler = serverless(app)
