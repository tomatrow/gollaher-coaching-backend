import { setMember } from "../controllers/MailChimp.js"

export const path = "/book"

export const method = "post"

export async function callback(ctx, next) {
    const { email, name, phone, path } = ctx.getValidBodyJSON()
    ctx.assert(
        email && name && phone && path,
        400,
        "Expected body.email, body.name, body.phone, and body.path"
    )

    // add this person to the audience with `transactional` status
    try {
        const response = await setMember(email, "transactional", {
            NAME: name,
            PHONE: phone,
            ORIGIN: "Booking",
            PATH: path
        })
        ctx.status = 200
        console.log("/book success", email, name, phone, path)
    } catch (error) {
        ctx.status = 500
        console.error("/book error", error, email, name, phone, path)
    }

    await next()
}
