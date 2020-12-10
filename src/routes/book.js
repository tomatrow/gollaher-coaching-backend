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
    // tag them as a booking
    try {
        const response = await setMember(email, "transactional", {
            NAME: name,
            PHONE: phone,
            ORIGIN: "Booking",
            PATH: path
        })
        console.log(response)
        ctx.status = 200
    } catch (error) {
        ctx.status = 500
    }

    await next()
}
