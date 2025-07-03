export type BalanceResultResponseType = {
    error: boolean,
    redirect?: string,
    response: {
        balance: number,
    }
}