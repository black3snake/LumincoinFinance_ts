import {ValidationsInterface} from "../interfaces/validations.interface";
import {ValidationsOptionType, ValidationsType} from "../types/validations.type";

export class ValidationUtils {

    public static validationForm(validations: ValidationsType[]): boolean {
        let isValid = true;

        for (let i = 0; i < validations.length; i++) {
            if (!ValidationUtils.validateFields(validations[i].element as HTMLInputElement, validations[i].options as ValidationsOptionType, validations[i].elementAppend )) {
                isValid = false;
            }
        }
        return isValid;
    }

    public static validateFields(element: HTMLInputElement, options:ValidationsOptionType, elementAppend: HTMLElement | null = null): boolean {
        let condition: boolean | string | RegExp | null = element.value;
        if (options) {
            if (options.hasOwnProperty('pattern')) {
                condition = element.value && !!element.value.match(options.pattern as RegExp);
            } else if (options.hasOwnProperty('compareTo')) {
                condition = element.value && element.value === options.compareTo;
            } else if (options.hasOwnProperty('checkProperty')) {
                condition = options.checkProperty as string;
            } else if (options.hasOwnProperty('checked')) {
                condition = element.checked;
            }
        }


        if (condition) {
            element.classList.remove('is-invalid');
            if (elementAppend) {
                elementAppend.style.borderColor = '#dee2e6';
            }
            return true;
        } else {
            element.classList.add('is-invalid');
            if (elementAppend) {
                element.style.borderLeft = '1px solid #dee2e6';
                elementAppend.style.border = '1px solid red';
            }
            return false;
        }

    }
}