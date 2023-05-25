import axios from 'axios'

const host = "127.0.0.1"
const port = "8081"
export const userRequest = axios.create({
    baseURL: 'http://' + host + ':' + port + '/user',
})

export const fileRequest = axios.create({
    baseURL: 'http://' + host + ':' + port + '/file'
})

export const textRequest = axios.create({
    baseURL: 'http://' + host + ':' + port + '/text'
})

export const statisticsRequest = axios.create({
    baseURL: 'http://' + host + ':' + port + '/statistics'
})

export const detectListRequest = axios.create({
    baseURL: 'http://' + host + ':' + port + '/detect_list'
})

export const smsRequest = axios.create({
    baseURL: 'http://' + host + ':' + port + '/sms'
})

