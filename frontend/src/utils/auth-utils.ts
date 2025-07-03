import config from "../config/config";
import {UserInfoType} from "../types/user-info.type";
import {AuthRefreshType} from "../types/auth-refresh.type";
import {AuthErrorType} from "../types/auth-error.type";

export class AuthUtils {
    public static accessTokenKey: string = 'accessToken';
    public static refreshTokenKey: string = 'refreshToken';
    public static userinfoTokenKey: string = 'userinfo';


    public static setAuthInfo(accessToken: string, refreshToken: string, userinfo: {[key: string]: string} | null = null): void {
        localStorage.setItem(this.accessTokenKey, accessToken);
        localStorage.setItem(this.refreshTokenKey, refreshToken);
        if (userinfo) {
            localStorage.setItem(this.userinfoTokenKey, JSON.stringify(userinfo));
        }
    }

    public static removeAuthInfo(): void {
        localStorage.removeItem(this.accessTokenKey);
        localStorage.removeItem(this.refreshTokenKey);
        localStorage.removeItem(this.userinfoTokenKey);

    }

    public static getAuthInfo(key: string | null = null): UserInfoType {
        if (key && [this.accessTokenKey, this.refreshTokenKey, this.userinfoTokenKey].includes(key)) {
            return localStorage.getItem(key)
        } else {
            return {
                [this.accessTokenKey]: localStorage.getItem(this.accessTokenKey),
                [this.refreshTokenKey]: localStorage.getItem(this.refreshTokenKey),
                [this.userinfoTokenKey]: localStorage.getItem(this.userinfoTokenKey),

            }
        }
    }

    public static async updateRefreshToken(): Promise<boolean> {
        let result: boolean = false;
        const refreshToken: UserInfoType | string | null = this.getAuthInfo(this.refreshTokenKey);
        if (refreshToken) {
            const response: Response = await fetch(config.api + '/refresh', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({refreshToken: refreshToken})
            })
            if (response && response.status === 200) {
                const tokens: AuthRefreshType | AuthErrorType = await response.json();
                if (tokens && !(tokens as AuthErrorType).error) {
                    AuthUtils.setAuthInfo((tokens as AuthRefreshType).tokens.accessToken, (tokens as AuthRefreshType).tokens.refreshToken);
                    result = true;
                }
            }
        }

        if (!result) {
            this.removeAuthInfo();
        }
        return result;
    }

}