import {HttpUtils} from "../utils/http-utils";
import {
    IncomeCategoriesDeleteResponse,
    IncomeCategoriesResponse, IncomeServiceReturnObjDeleteType, IncomeServiceReturnObjIdType,
    IncomeServiceReturnObjType
} from "../types/income-service-return-obj.type";
import {ChangeDataType} from "../types/change-data.type";
import {CreateDataType} from "../types/create-data.type";

export class IncomeService {
    public static async getIncomes(): Promise<IncomeServiceReturnObjType> {
        const returnObject: IncomeServiceReturnObjType = {
            error: false,
            redirect: '',
            incomes: null
        };

        const result: IncomeCategoriesResponse = await HttpUtils.request('/categories/income');

        if (result.redirect || result.error || !result.response) {
            // (result.response && (result.response.error || !result.response.message || result.response.message))) {
            console.log('Возникла ошибка при запросе доходов');
            if (result.redirect) {
                returnObject.redirect = result.redirect;  // перевод пользователя на другую страницу
            }
            return returnObject;
        }
        returnObject.incomes = result.response;
        return returnObject;
    }

    static async getIncome(id: string): Promise<IncomeServiceReturnObjType> {
        const returnObject: IncomeServiceReturnObjType = {
            error: false,
            redirect: '',
            incomes: null
        };

        const result: IncomeCategoriesResponse = await HttpUtils.request('/categories/income/' + id);

        if (result.redirect || result.error || !result.response) {
            console.log('Возникла ошибка при запросе дохода');
            if (result.redirect) {
                returnObject.redirect = result.redirect;  // перевод пользователя на другую страницу
            }
            return returnObject;
        }
        returnObject.incomes = result.response;
        return returnObject;
    }

    public static async updateIncome(id: number, data: ChangeDataType): Promise<IncomeServiceReturnObjType> {
        const returnObject: IncomeServiceReturnObjType = {
            error: false,
            redirect: null,
            incomes: null
        };

        const result: IncomeCategoriesResponse = await HttpUtils.request('/categories/income/' + id, 'PUT', true, data);
        if (result.redirect || result.error || !result.response) {
            console.log('Возникла ошибка при редактировании дохода');
            if (result.redirect) {
                returnObject.redirect = result.redirect;  // перевод пользователя на другую страницу
            }
            return returnObject;
        }
        return returnObject;
    }

    public static async createIncome(data: CreateDataType): Promise<IncomeServiceReturnObjIdType> {
        const returnObject: IncomeServiceReturnObjIdType = {
            error: false,
            redirect: null,
            id: null
        };

        const result: IncomeCategoriesResponse = await HttpUtils.request('/categories/income', 'POST', true, data);

        if (result.redirect || result.error || !result.response) {
            console.log('Возникла ошибка при добавлении дохода');
            if (result.redirect) {
                returnObject.redirect = result.redirect;  // перевод пользователя на другую страницу
            }
            return returnObject;
        }
        returnObject.id = result.response.id;
        return returnObject;
    }

    static async deleteIncome(id: string): Promise<IncomeServiceReturnObjDeleteType> {
        const returnObject: IncomeServiceReturnObjDeleteType = {
            error: false,
            redirect: null,
        };

        const result: IncomeCategoriesDeleteResponse = await HttpUtils.request('/categories/income/' + id, 'DELETE');

        if (result.redirect || result.error || !result.response) {
            console.log('Возникла ошибка при удалении заказа');
            if (result.redirect) {
                returnObject.redirect = result.redirect;  // перевод пользователя на другую страницу
            }
            return returnObject;
        }
        return returnObject;
    }
}