import {userRequest} from "@/utils/request";

export function login(username: string, password: string) {
    return userRequest.post('/login', {
        username: username,
        password: password
    })
}

export function signup(username: string, password: string) {
    return userRequest.post('/signup', {
        username: username,
        password: password
    })
}