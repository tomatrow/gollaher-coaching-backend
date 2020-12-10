import mailchimp from "@mailchimp/mailchimp_marketing"
import md5 from "md5"

mailchimp.setConfig({
    apiKey: process.env.MAILCHIMP_API_KEY,
    server: process.env.MAILCHIMP_SERVER_PREFIX
})

export function setMember(email_address, status_if_new, merge_fields = {}) {
    return mailchimp.lists.setListMember(
        process.env.MAILCHIMP_AUDIENCE_ID,
        md5(email_address.toLowerCase()),
        {
            email_address,
            status_if_new,
            merge_fields
        }
    )
}

export default mailchimp
