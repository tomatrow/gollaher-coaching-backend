import Router from "@koa/router"

import * as Book from "./routes/book.js"
import * as Ping from "./routes/ping.js"
import * as Subscribe from "./routes/subscribe.js"
import * as Instagram from "./routes/instagram.js"

const root = new Router({ prefix: `/.netlify/functions/${process.env.SERVER_PATH}` })

// add routes to specified router
function addRoutes(router, routes) {
    for (let route of routes) {
        // check route is well defined
        for (let key of ["path", "method", "callback"])
            if (route[key] === undefined)
                throw new Error(`Undefined route: ${route.path} ${route.method} at ${key}`)
        // add it
        router[route.method](route.path, route.callback)
    }
}

// add routes to a parent router
function addSubRoutes(path, routes, parent = root) {
    const child = new Router()
    addRoutes(child, routes)
    parent.use(path, child.routes(), child.allowedMethods())
    return child
}

addRoutes(root, [Book, Ping, Subscribe, Instagram])

export default root
