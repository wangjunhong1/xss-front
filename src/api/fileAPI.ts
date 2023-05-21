import {fileRequest} from "@/utils/request";
import {useUserStore} from "@/stores/user";

export function predict(model: string) {
    return fileRequest.post('/predict', {
        username: useUserStore().username,
        name: model
    })
}