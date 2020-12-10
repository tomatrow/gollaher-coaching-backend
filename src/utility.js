import crypto from "crypto"

export default {
    state: {
        isProduction: !!process.env.NETLIFY
    },
    verify(key, target) {
        if (!this.state.isProduction) return
        const hash = crypto
            .createHmac("sha256", key)
            .update(this.request.rawBody, "utf8", "hex")
            .digest("base64")
        this.assert(target === hash, 403)
    },
    getValidBodyJSON() {
        this.assert(this.is("application/json"), "Expected json")
        const { body } = this.request
        this.assert(body !== undefined, "Expected body")
        this.log(body)
        return body
    },
    log(value) {
        try {
            console.log(JSON.stringify(value, null, 2))
        } catch {
            console.log(value)
        }
    }
}
