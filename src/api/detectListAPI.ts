import {detectListRequest} from "@/utils/request";
import {useUserStore} from "@/stores/user";

export function page_list(current: number, size: number) {
    return detectListRequest.get('/list_page', {
        params: {
            username: useUserStore().username,
            current: current,
            size: size
        }
    })
}

export function page_filter_list(start: Date | null, end: Date | null, current: number, size: number) {
    return detectListRequest.get('/filter_list', {
        params: {
            username: useUserStore().username,
            start: start == null ? 0 : start.getTime(),
            end: end == null ? 0 : end.getTime(),
            current: current,
            size: size
        }
    })
}

export function list(start: Date | null, end: Date | null) {
    return detectListRequest.get('/list', {
        params: {
            username: useUserStore().username,
            start: start == null ? 0 : start.getTime(),
            end: end == null ? 0 : end.getTime()
        }
    })
}