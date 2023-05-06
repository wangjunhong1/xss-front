import {textRequest} from "@/utils/request";

export function predict( text: string) {
    return textRequest.post('/predict', {
         text: text
    })
}