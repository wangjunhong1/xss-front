import {textRequest} from "@/utils/request";
import {useUserStore} from "@/stores/user";

export function predict(text: string) {
    return textRequest.post('/predict', {
        username: useUserStore().username,
        text: text
    })
}