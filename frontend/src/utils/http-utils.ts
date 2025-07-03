import {AuthUtils} from "./auth-utils";
import config from "../config/config";
import {UserInfoType} from "../types/user-info.type";
import {HttpParamsType} from "../types/http-params.type";

export class HttpUtils {
    public static async request(url: string, method: string = "GET", useAuth: boolean = true, body: any = null): Promise<any> {
        const result = {
            error: false,
            response: null,
            redirect: '',
        }

        const params: HttpParamsType = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        }

        let token: UserInfoType = null;
        if (useAuth) {
            token = AuthUtils.getAuthInfo(AuthUtils.accessTokenKey);
            if (token) {
                params.headers['x-auth-token'] = token as string;
                // params.headers.authorization = token; // можно так
            }
        }

        if (body) {
            params.body = JSON.stringify(body);
        }

        let response: Response | null = null;
        try {
            response = await fetch(config.api + url, params)
            result.response = await response.json();

        } catch (e) {
            result.error = true;
            return result;
        }

        if (response.status < 200 || response.status >= 300) {
            result.error = true;
            if (useAuth && response.status === 401) {
                if (!token) {
                    // 1 - токена нет
                    result.redirect = '/login';
                } else {
                    // 2 - токен устарел/ не валидный (надо обновить)
                    const updateTokenResult: boolean = await AuthUtils.updateRefreshToken();
                    if (updateTokenResult) {
                        // Делаем запрос повторно
                        return this.request(url, method, useAuth, body);
                    } else {
                        result.redirect = '/login';

                    }

                }


            }
        }

        return result;
    }
}