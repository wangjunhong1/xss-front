import axios from 'axios'

export const userRequest = axios.create({
    baseURL: 'http://127.0.0.1:8080/user',
})

export const fileRequest = axios.create({
    baseURL: 'http://127.0.0.1:8080/file'
})

export const textRequest = axios.create({
    baseURL: 'http://127.0.0.1:8080/text'
})

export const statisticsRequest = axios.create({
    baseURL: 'http://127.0.0.1:8080/statistics'
})

export const detectListRequest = axios.create({
    baseURL: 'http://127.0.0.1:8080/detect_list'
})

