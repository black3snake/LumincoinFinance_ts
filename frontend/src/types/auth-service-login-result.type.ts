export type AuthServiceLoginResonseType = {
    error: boolean,
    redirect: string,
    response: AuthServiceLoginResultType
    message?: string,
}

export type AuthServiceLoginResultType = {
    tokens: {
        accessToken: string,
        refreshToken: string,
    },
    user: {
        name: string,
        lastName: string,
        id: number,
    }
}