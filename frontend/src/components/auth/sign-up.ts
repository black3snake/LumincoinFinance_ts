import {ValidationUtils} from "../../utils/validation-utils";
import {AuthUtils} from "../../utils/auth-utils";
import {AuthService} from "../../services/auth-service";
import {ValidationsOptionType, ValidationsType} from "../../types/validations.type";
import {OpenNewRouteHandlerType} from "../../types/open-new-route-handler.type";
import {AuthServiceLoginResultType} from "../../types/auth-service-login-result.type";
import {AuthServiceSignupResultType} from "../../types/auth-service-signup-result.type";

export class SignUp {
    private readonly validations: ValidationsType[] = [];
    private readonly openNewRoute: OpenNewRouteHandlerType;
    private nameElement: HTMLElement | null;
    private nameAppendElement: HTMLElement | null;
    private lastNameElement: HTMLElement | null;
    private lastNameAppendElement: HTMLElement | null;
    private emailElement: HTMLElement | null;
    private emailAppendElement: HTMLElement | null;
    private passwordElement: HTMLElement | null;
    private passwordAppendElement: HTMLElement | null;
    private passwordRepeatElement: HTMLElement | null;
    private passwordRepeatAppendElement: HTMLElement | null;
    private commonErrorElement: HTMLElement | null;
    private processButtonElement: HTMLElement | null;

    constructor(openNewRoute: OpenNewRouteHandlerType) {
        this.openNewRoute = openNewRoute;

        this.nameElement = document.getElementById('name');
        this.nameAppendElement = document.getElementById('nameAppend');
        this.lastNameElement = document.getElementById('lastname');
        this.lastNameAppendElement = document.getElementById('lastnameAppend');
        this.emailElement = document.getElementById('email');
        this.emailAppendElement = document.getElementById('emailAppend');
        this.passwordElement = document.getElementById('password');
        this.passwordAppendElement = document.getElementById('passwordAppend');
        this.passwordRepeatElement = document.getElementById('repassword');
        this.passwordRepeatAppendElement = document.getElementById('repasswordAppend');
        this.commonErrorElement = document.getElementById('common-error');
        this.processButtonElement = document.getElementById('process-button');

        this.validations = [
            {element: this.nameElement, elementAppend: this.nameAppendElement},
            {element: this.lastNameElement, elementAppend: this.lastNameAppendElement},
            {
                element: this.emailElement,
                options: {pattern: /^([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/},
                elementAppend: this.emailAppendElement
            },
            {
                element: this.passwordElement,
                options: {pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/},
                elementAppend: this.passwordAppendElement
            },
            {
                element: this.passwordRepeatElement,
                options: {compareTo: (this.passwordElement as HTMLInputElement).value},
                elementAppend: this.passwordRepeatAppendElement
            },
        ];

        if (this.processButtonElement) {
            this.processButtonElement.addEventListener('click', this.signUp.bind(this));
        }

    }


    private async signUp(): Promise<void> {
        if (this.commonErrorElement) {
            this.commonErrorElement.style.display = 'none';
        }
        this.validations.forEach(validation => {
            if (validation.element === this.passwordRepeatElement) {
                (validation.options as ValidationsOptionType).compareTo = (this.passwordElement as HTMLInputElement).value;
            }
        })

        if (ValidationUtils.validationForm(this.validations)) {
            // request
            const signUpResult: AuthServiceSignupResultType | boolean  = await AuthService.signUp({
                name: (this.nameElement as HTMLInputElement).value,
                lastName: (this.lastNameElement as HTMLInputElement).value,
                email: (this.emailElement as HTMLInputElement).value,
                password: (this.passwordElement as HTMLInputElement).value,
                passwordRepeat: (this.passwordRepeatElement as HTMLInputElement).value
            })

            if (signUpResult) {
                const loginResult: AuthServiceLoginResultType | boolean = await AuthService.logIn({
                    email: (signUpResult as AuthServiceSignupResultType).user.email,
                    password: (signUpResult as AuthServiceSignupResultType).user.password,
                    rememberMe: false
                });
                if (loginResult) {
                    AuthUtils.setAuthInfo((loginResult as AuthServiceLoginResultType).tokens.accessToken, (loginResult as AuthServiceLoginResultType).tokens.refreshToken, {
                        id: (loginResult as AuthServiceLoginResultType).user.id.toString(),
                        name: (loginResult as AuthServiceLoginResultType).user.name + ' ' + (loginResult as AuthServiceLoginResultType).user.lastName,
                    });
                    return this.openNewRoute('/');
                }
            }
            if (this.commonErrorElement) {
                this.commonErrorElement.style.display = 'block';
            }
        }
    }

}