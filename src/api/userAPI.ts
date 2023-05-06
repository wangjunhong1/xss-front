import {userRequest} from "@/utils/request";

export function login(username: string, password: string) {
    return userRequest.post('/login', {
        username: username,
        password: password
    })
}