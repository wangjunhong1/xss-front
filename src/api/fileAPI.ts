import {fileRequest} from "@/utils/request";

export function predict(model: string) {
    return fileRequest.post('/predict', {
        name: model
    })
}