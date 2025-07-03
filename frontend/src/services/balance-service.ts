import {HttpUtils} from "../utils/http-utils";
import {BalanceResultResponseType} from "../types/balance-result-response.type";
import {BalanceResultType} from "../types/balance-result.type";

export class BalanceService {
    public static async getBalance(): Promise<BalanceResultType> {
        const returnObject: BalanceResultType = {
            error: false,
            redirect: '',
            balance: 0,
        };
        const result: BalanceResultResponseType = await HttpUtils.request('/balance');

        if (result.redirect || result.error || !result.response) {
            console.log('Возникла ошибка при запросе баланса');
            if (result.redirect) {
                returnObject.redirect = result.redirect;  // перевод пользователя на другую страницу
            }
            return returnObject;
        }
        returnObject.balance = result.response.balance;
        return returnObject;
    }
}