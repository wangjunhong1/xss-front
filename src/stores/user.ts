import {defineStore} from 'pinia'

export const useUserStore = defineStore('user', {
    persist: {
        enabled: true,//开启数据持久化
        strategies: [
            {
                key: 'user',//给一个要保存的名称
                storage: sessionStorage,//sessionStorage / localStorage 存储方式
            }
        ]
    },
    state: () => {
        return {
            username: ""
        }
    },
    actions: {
        login(username: string) {
            this.username = username
        },
        logout() {
            this.username = ""
        }
    }
})

export const userLocalStorage = defineStore('userLocalStorage', {
    persist: {
        enabled: true,//开启数据持久化
        strategies: [
            {
                key: 'userLocalStorage',//给一个要保存的名称
                storage: localStorage,//sessionStorage / localStorage 存储方式
            }
        ]
    },
    state: () => {
        return {
            username: ""
        }
    },
    actions: {
        login(username: string) {
            this.username = username
        },
        logout() {
            this.username = ""
        }
    }
})
