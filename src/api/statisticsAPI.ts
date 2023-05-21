import {statisticsRequest} from "@/utils/request";
import {useUserStore} from "@/stores/user";

export function get_card_data() {
    return statisticsRequest.get('/card_data', {
        params:{
            username: useUserStore().username
        }
    })
}

export function get_bar_data() {
    return statisticsRequest.get('/bar_data', {
        params: {
            username: useUserStore().username
        }
    })
}

export function get_pie_data() {
    return statisticsRequest.get('/pie_data', {
        params: {
            username: useUserStore().username
        }
    })
}