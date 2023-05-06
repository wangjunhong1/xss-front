import {detectListRequest} from "@/utils/request";

export function page_list(current: number, size: number) {
    return detectListRequest.get('/list_page', {
        params: {
            current: current,
            size: size
        }
    })
}

export function page_filter_list(start: Date | null, end: Date | null, current: number, size: number) {
    return detectListRequest.get('/filter_list', {
        params: {
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
            start: start == null ? 0 : start.getTime(),
            end: end == null ? 0 : end.getTime()
        }
    })
}