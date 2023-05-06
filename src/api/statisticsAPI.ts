import {statisticsRequest} from "@/utils/request";

export function get_card_data() {
    return statisticsRequest.post('/card_data')
}

export function get_bar_data() {
    return statisticsRequest.get('/bar_data')
}

export function get_pie_data() {
    return statisticsRequest.get('/pie_data')
}