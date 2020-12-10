if (!process.env.SERVER_PATH) throw new Error("SERVER_PATH is needed")

export default {
    input: "src/index.js",
    output: {
        file: `functions/${process.env.SERVER_PATH}/app.js`,
        format: "cjs",
        exports: "default"
    },
    external: ["@koa/cors", "@koa/router", "koa", "koa-bodyparser", "crypto", "axios"]
}
