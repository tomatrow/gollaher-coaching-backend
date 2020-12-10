#! /usr/bin/env node

import prettier from "prettier"
import { promises as fs } from "fs"

async function format(path, cache, config) {
    try {
        const stat = await fs.stat(path)
        if (stat.mtimeMs == cache[path]) return true

        const contents = await fs.readFile(path, "utf8")
        const formatted = prettier.format(contents, {
            filepath: path,
            pluginSearchDirs: ["."],
            ...config
        })
        if (formatted == contents) {
            console.log(`\x1b[2m${path}\x1b[0m`)
            cache[path] = stat.mtimeMs
            return true
        }

        console.log(path)
        await fs.writeFile(path, formatted)
        cache[path] = (await fs.stat(path)).mtimeMs
        return true
    } catch (err) {
        console.error(`\x1b[31m${path}\x1b[0m`)
        console.error(err.message)
        return false
    }
}

;(async function () {
    const CACHE_FILE = ".caching-prettier-cache"

    let cache = {}
    try {
        cache = JSON.parse(await fs.readFile(CACHE_FILE, "utf8"))
    } catch (err) {}

    let config = {}
    try {
        const filePath = await prettier.resolveConfigFile()
        config = await prettier.resolveConfig(filePath)
    } catch (err) {}

    const files = process.argv.slice(2)
    const res = await Promise.all(files.map(o => format(o, cache, config)))
    await fs.writeFile(CACHE_FILE, JSON.stringify(cache))

    if (res.some(o => !o)) process.exit(1)
})()
