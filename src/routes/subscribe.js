import { setMember } from "../controllers/MailChimp.js"

export const path = "/subscribe"

export const method = "post"

export async function callback(ctx, next) {
    const { email, path } = ctx.getValidBodyJSON()
    ctx.assert(email && path, 400, "Expected body.email and body.path")

    // add this person to the audience with status of `pending` if new
    try {
        const response = await setMember(email, "pending", {
            ORIGIN: "Subscription",
            PATH: path
        })
        console.log(response)
        ctx.status = 200
    } catch (error) {
        ctx.status = 500
    }

    await next()
}
