export interface ValidationsInterface {
    element: HTMLElement | null; // или более конкретный тип, например HTMLInputElement
    elementAppend?: HTMLElement | null; // элемент для вывода ошибок
    options?: {
        pattern?: RegExp; // регулярное выражение для валидации
        minLength?: number;
        maxLength?: number;
        required?: boolean;
        // другие возможные параметры валидации
    };
}

