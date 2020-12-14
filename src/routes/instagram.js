import axios from "axios"

export const path = "/instagram"

export const method = "get"

// Get the instagram access token for this site
export async function callback(ctx, next) {
    const response = await axios(process.env.INSTANT_TOKENS_ENDPOINT)
    console.log(response)

    const { Token } = response.data
    ctx.body = { token: Token }

    ctx.status = 200
    await next()
}
