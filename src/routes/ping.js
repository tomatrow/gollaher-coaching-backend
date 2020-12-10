import mailchimp from "../controllers/MailChimp.js"

export const path = "/ping"

export const method = "get"

export async function callback(ctx, next) {
    const response = await mailchimp.ping.get()
    console.log(response)
    ctx.body = response

    ctx.status = 200
    await next()
}
