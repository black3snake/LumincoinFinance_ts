import {HttpUtils} from "../utils/http-utils";
import {AuthServiceLoginType} from "../types/auth-service-login.type";
import {AuthServiceLoginResonseType, AuthServiceLoginResultType} from "../types/auth-service-login-result.type";
import {AuthErrorType} from "../types/auth-error.type";
import {AuthServiceSignupType} from "../types/auth-service-signup.type";
import {AuthServiceSignupResultResposeType} from "../types/auth-service-signup-result-respose.type";
import {AuthServiceSignupResponseType, AuthServiceSignupResultType} from "../types/auth-service-signup-result.type";
import {AuthServiceLogout} from "../types/auth-service-logout.type";

export class AuthService {
    public static async logIn(data: AuthServiceLoginType): Promise<AuthServiceLoginResultType | boolean> {
        const result: AuthServiceLoginResonseType = await HttpUtils.request('/login', 'POST', false, data);

        if (result.error || !result.response || (result.response.tokens && (!result.response.tokens.accessToken || !result.response.tokens.refreshToken)) ||
            (result.response.user && (!result.response.user.id || !result.response.user.name || !result.response.user.lastName))) {
            return false;
        }
        return result.response;
    }

    static async signUp(data: AuthServiceSignupType): Promise<AuthServiceSignupResultType | boolean> {
        const result: AuthServiceSignupResponseType = await HttpUtils.request('/signup', 'POST', false, data);

        if (result.error || !result.response || (result.response.user && (!result.response.user.id ||
            !result.response.user.email || !result.response.user.lastName || !result.response.user.name))) {
            return false;
        }
        return result.response;
    }

    static async logout(data: AuthServiceLogout): Promise<void> {
        // request
        await HttpUtils.request('/logout', 'POST', false, data);

    }
}