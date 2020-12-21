import axios from "axios"

export const path = "/instagram"

export const method = "get"

// Get the instagram access token for this site
export async function callback(ctx, next) {
    try {
        const response = await axios(process.env.INSTANT_TOKENS_ENDPOINT)
        const { Token } = response.data
        ctx.body = { token: Token }
        ctx.status = 200
        console.log(path, `Token: ${Token}`)
    } catch (error) {
        console.error("${path} failure")
        ctx.throw()
    }

    await next()
}
