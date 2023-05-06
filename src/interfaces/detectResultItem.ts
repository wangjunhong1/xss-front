export interface DetectResultItem {
    index: number | string,
    url: string,
    useModel: string,
    startDate: string,
    finishDate: string | Date,
    result: string | boolean,
    keyword: string
}