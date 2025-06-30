export type AuthErrorType = {
    error: boolean,
    message: string,
    validation: Array<{
        key: string | null,
        message: string | null,
    }>

}