export type OperationsServiceReturnObjType = {
    error: false,
    redirect: string | null,
    operations: OperationsCategory | null,
}
export type OperationsCategoriesResponse = {
    error: boolean,
    response: OperationsCategory,
    redirect?: string,
}
export type OperationsCategory = {
    id: number,
    // title: string
    amount: number,
    category: string,
    comment: string,
    date: string
    type: string,
}
export type OperationsServiceReturnObjIdType = {
    error: false,
    redirect: string | null,
    id: number | null,
}
export type OperationsServiceReturnObjDeleteType = {
    error: false,
    redirect: string | null,
}
export type OperationsCategoriesDeleteResponse = {
    error: boolean,
    response: OperationsCategoriesDeleteResponseError,
    redirect?: string,
}
export type OperationsCategoriesDeleteResponseError = {
    error: boolean,
    message: string,
}
