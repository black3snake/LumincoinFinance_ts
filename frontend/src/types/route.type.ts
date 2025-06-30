export type RouteType = {
    route: string,
    title?: string,
    filePathTemplate?: string,
    useLayout?: string | boolean,
    load?(): void
    unload?(): void
    styles?: Array<string>
    scripts?: Array<string>
}

