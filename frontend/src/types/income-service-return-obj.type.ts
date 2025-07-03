export type IncomeServiceReturnObjType = {
    error: false,
    redirect: string | null,
    incomes: IncomeCategory | null,
}
export type IncomeCategoriesResponse = {
    error: boolean,
    response: IncomeCategory,
    redirect?: string,
}
export type IncomeCategory = {
    id: number,
    title: string
}
export type IncomeServiceReturnObjIdType = {
    error: false,
    redirect: string | null,
    id: number | null,
}
export type IncomeServiceReturnObjDeleteType = {
    error: false,
    redirect: string | null,
}
export type IncomeCategoriesDeleteResponse = {
    error: boolean,
    response: IncomeCategoriesDeleteResponseError,
    redirect?: string,
}
export type IncomeCategoriesDeleteResponseError = {
    error: boolean,
    message: string,
}
