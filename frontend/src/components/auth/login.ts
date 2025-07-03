import {ValidationUtils} from "../../utils/validation-utils";
import {AuthUtils} from "../../utils/auth-utils";
import {AuthService} from "../../services/auth-service";
import {OpenNewRouteHandlerType} from "../../types/open-new-route-handler.type";
import {ValidationsType} from "../../types/validations.type";
import {AuthServiceLoginResultType} from "../../types/auth-service-login-result.type";

export class Login {
    private readonly validations: ValidationsType[] = [];

    private emailElement: HTMLElement | null;
    private passwordElement: HTMLElement | null;
    private processButtonElement: HTMLElement | null;
    private emailAppendElement: HTMLElement | null;
    private passwordAppendElement: HTMLElement | null;
    private rememberMeElement: HTMLElement | null;
    private commonErrorElement: HTMLElement | null;
    readonly openNewRoute: OpenNewRouteHandlerType;

    constructor(openNewRoute: OpenNewRouteHandlerType) {
        this.openNewRoute = openNewRoute;
        this.emailElement = document.getElementById('email');
        this.emailAppendElement = document.getElementById('emailAppend');
        this.passwordElement = document.getElementById('password');
        this.passwordAppendElement = document.getElementById('passwordAppend');
        this.rememberMeElement = document.getElementById('remember-me');
        this.commonErrorElement = document.getElementById('common-error');
        this.processButtonElement = document.getElementById('process-button');

        if (AuthUtils.getAuthInfo(AuthUtils.accessTokenKey) ) {
            this.openNewRoute('/');
            return;
        }

        // this.findElements();

        if(this.processButtonElement) {
            this.processButtonElement.addEventListener('click', this.login.bind(this));
        }
        this.validations = [
            {element: this.emailElement, options: {pattern: /^([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/}, elementAppend: this.emailAppendElement},
            {element: this.passwordElement, elementAppend: this.passwordAppendElement}
        ]
    }
    private findElements(): void {
    }

    public async login(): Promise<void> {
        if (this.commonErrorElement) {
            this.commonErrorElement.style.display = 'none';
        }
        if (ValidationUtils.validationForm(this.validations)) {
            //request

            const loginResult: AuthServiceLoginResultType | boolean = await AuthService.logIn({
                email: (this.emailElement as HTMLInputElement).value,
                password: (this.passwordElement as HTMLInputElement).value,
                rememberMe: (this.rememberMeElement as HTMLInputElement).checked,
            });

            if (loginResult) {
                AuthUtils.setAuthInfo((loginResult as AuthServiceLoginResultType).tokens.accessToken, (loginResult as AuthServiceLoginResultType).tokens.refreshToken, {
                    id: (loginResult as AuthServiceLoginResultType).user.id.toString(),
                    name: (loginResult as AuthServiceLoginResultType).user.name + ' ' + (loginResult as AuthServiceLoginResultType).user.lastName,
                });
                return this.openNewRoute('/');
            }
            if (this.commonErrorElement) {
                this.commonErrorElement.style.display = 'block';
            }
        }
    }

}