import {HttpUtils} from "../utils/http-utils";
import {
    ExpensesCategoriesDeleteResponse,
    ExpensesCategoriesResponse, ExpensesServiceReturnObjDeleteType,
    ExpensesServiceReturnObjIdType,
    ExpensesServiceReturnObjType
} from "../types/expenses-service-return-obj.type";
import {ChangeDataType} from "../types/change-data.type";
import {CreateDataType} from "../types/create-data.type";

export class ExpensesService {
    public static async getExpenses():Promise<ExpensesServiceReturnObjType> {
        const returnObject: ExpensesServiceReturnObjType = {
            error: false,
            redirect: null,
            expenses: null
        };

        const result: ExpensesCategoriesResponse = await HttpUtils.request('/categories/expense');

        if (result.redirect || result.error || !result.response) {
            console.log('Возникла ошибка при запросе расходов');
            if (result.redirect) {
                returnObject.redirect = result.redirect;  // перевод пользователя на другую страницу
            }
            return returnObject;
        }
        returnObject.expenses = result.response;
        return returnObject;
    }

    static async getExpense(id: string): Promise<ExpensesServiceReturnObjType> {
        const returnObject: ExpensesServiceReturnObjType= {
            error: false,
            redirect: null,
            expenses: null
        };

        const result: ExpensesCategoriesResponse = await HttpUtils.request('/categories/expense/' + id);

        if (result.redirect || result.error || !result.response) {
            console.log('Возникла ошибка при запросе расхода');
            if (result.redirect) {
                returnObject.redirect = result.redirect;  // перевод пользователя на другую страницу
            }
            return returnObject;
        }
        returnObject.expenses = result.response;
        return returnObject;
    }

    static async updateExpense(id:number, data: ChangeDataType): Promise<ExpensesServiceReturnObjType> {
        const returnObject: ExpensesServiceReturnObjType = {
            error: false,
            redirect: null,
            expenses: null
        };

        const result: ExpensesCategoriesResponse = await HttpUtils.request('/categories/expense/' + id, 'PUT', true, data);
        if (result.redirect || result.error || !result.response) {
            console.log('Возникла ошибка при редактировании дохода');
            if (result.redirect) {
                returnObject.redirect = result.redirect;  // перевод пользователя на другую страницу
            }
            return returnObject;
        }
        return returnObject;
    }

    static async createExpense(data: CreateDataType): Promise<ExpensesServiceReturnObjIdType> {
        const returnObject: ExpensesServiceReturnObjIdType = {
            error: false,
            redirect: null,
            id: null
        };

        const result: ExpensesCategoriesResponse = await HttpUtils.request('/categories/expense', 'POST', true, data);

        if (result.redirect || result.error || !result.response ) {
            console.log('Возникла ошибка при добавлении дохода');
            if (result.redirect) {
                returnObject.redirect = result.redirect;  // перевод пользователя на другую страницу
            }
            return returnObject;
        }
        returnObject.id = result.response.id;
        return returnObject;
    }

    static async deleteExpense(id: string): Promise<ExpensesServiceReturnObjDeleteType> {
        const returnObject: ExpensesServiceReturnObjDeleteType = {
            error: false,
            redirect: null,
        };

        const result:ExpensesCategoriesDeleteResponse = await HttpUtils.request('/categories/expense/' + id, 'DELETE');

        if (result.redirect || result.error || !result.response ) {
            console.log('Возникла ошибка при удалении заказа');
            if (result.redirect) {
                returnObject.redirect = result.redirect;  // перевод пользователя на другую страницу
            }
            return returnObject;
        }
        return returnObject;
    }
}