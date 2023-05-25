import {smsRequest} from "@/utils/request";

export function sms_send(phoneNumber: string) {
    return smsRequest.post('/send', {
        phoneNumber: phoneNumber,
    })
}