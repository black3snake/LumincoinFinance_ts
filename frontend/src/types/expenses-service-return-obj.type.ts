export type ExpensesServiceReturnObjType = {
    error: false,
    redirect: string | null,
    expenses?: ExpensesCategory | null,
}
export type ExpensesCategoriesResponse = {
    error: boolean,
    response: ExpensesCategory,
    redirect?: string,
}
export type ExpensesCategory = {
    id: number,
    title: string
}
export type ExpensesServiceReturnObjIdType = {
    error: false,
    redirect: string | null,
    id: number | null,
}
export type ExpensesServiceReturnObjDeleteType = {
    error: false,
    redirect: string | null,
}
export type ExpensesCategoriesDeleteResponse = {
    error: boolean,
    response: ExpensesCategoriesDeleteResponseError,
    redirect?: string,
}
export type ExpensesCategoriesDeleteResponseError = {
    error: boolean,
    message: string,
}
