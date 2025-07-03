export type ValidationsType = {
    element: HTMLElement | null,
    elementAppend?: HTMLElement | null,
    options?: ValidationsOptionType,
}

export type ValidationsOptionType = {
    pattern?: RegExp,
    checked?: boolean,
    compareTo?: string,
    checkProperty?: string,
}
