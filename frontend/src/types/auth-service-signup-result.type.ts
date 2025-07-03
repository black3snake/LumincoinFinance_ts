export type AuthServiceSignupResponseType = {
    error: boolean,
    redirect: string,
    response: AuthServiceSignupResultType,
    message: string,
}

export type AuthServiceSignupResultType = {
    user: {
        id: number,
        name: string,
        lastName: string,
        email: string,
        password: string,
    }
}