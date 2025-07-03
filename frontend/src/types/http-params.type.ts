export type HttpParamsType = {
    method: string,
    headers: {
        [key: string]: string;
    },
    body?: string,
}