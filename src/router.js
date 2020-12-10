import Router from "@koa/router"

import * as Book from "./routes/book.js"
import * as Ping from "./routes/ping.js"
import * as Subscribe from "./routes/subscribe.js"

const router = new Router({ prefix: `/.netlify/functions/${process.env.SERVER_PATH}` })

function add(path, routes, parent = router) {
    const child = new Router()

    for (let route of routes) {
        // check route is well defined
        for (let key of ["path", "method", "callback"])
            if (route[key] === undefined)
                throw new Error(`Undefined route: ${route.path} ${route.method} at ${key}`)
        // add it
        child[route.method](route.path, route.callback)
    }

    parent.use(path, child.routes(), child.allowedMethods())
}

add("/", [Book, Ping, Subscribe])

export default router
