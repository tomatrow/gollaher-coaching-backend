#! /usr/bin/env node
import axios from "axios"
import yargs from "yargs"
import validator from "validator"
import { hideBin } from 'yargs/helpers'


// get the schema
async function main(base, path, evaluatedBody) {
    const baseURL = `${base}/.netlify/functions/${process.env.SERVER_PATH}`

    console.warn(`Fetching from: ${baseURL + path}` + evaluatedBody ? ` with body: '${evaluatedBody}'` : '')
    try {
        const server = axios.create({ baseURL })
        console.log(evaluatedBody)
        const response = evaluatedBody !== null ? await server.post(path, evaluatedBody) : await server.get(path)
        console.log(JSON.stringify(response.data, null, 2))
    } catch (error) {
        const { response } = error
        if (response) console.error(response.status, response.statusText, "\n", response.data)
        else console.error(error)
    }
}

const {
    production,
    body,
    _: [path]
} = yargs(hideBin(process.argv))
    .usage("Usage: $0 [options] <path> --body { message:'Hello World!' }")
    .example("$0 --production /", "fetch scheme from netlify")
    .demandCommand(1)
    .boolean("p")
    .alias("p", "production")
    .describe("p", "Use production server")
    .option('b', {
        alias: 'body',
        describe: 'js to send in body',
        type: 'string'
    })
    .help("h")
    .alias("h", "help").argv

let evaluatedBody = null
try {
    if (body) evaluatedBody = JSON.parse(body)
} catch (error) {
    throw new Error(`Invalid Body: '${body}'`)
}

// get the endpoint the the schema we want
if (!validator.isURL(path, { allow_protocol_relative_urls: true, require_host: false }))
    throw new Error(`Invalid Path: '${path}'`)

// create the base URL for our server
const PROJECT_NAME = process.env.PROJECT_NAME
if (PROJECT_NAME === undefined) throw new Error("PROJECT_NAME is undefined")
const base = production ? `https://${PROJECT_NAME}.netlify.app` : process.env.URL

main(base, path, evaluatedBody)
