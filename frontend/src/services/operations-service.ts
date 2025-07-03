import {HttpUtils} from "../utils/http-utils";
import {PeriodDateType} from "../types/period-date.type";
import {
    OperationsCategoriesDeleteResponse,
    OperationsCategoriesResponse, OperationsServiceReturnObjDeleteType, OperationsServiceReturnObjIdType,
    OperationsServiceReturnObjType
} from "../types/operations-service-return-obj.type";
import {CreateDataType} from "../types/create-data.type";
import {ChangeDataType} from "../types/change-data.type";

export class OperationsService {
    public static async getOperations(filter: PeriodDateType): Promise<OperationsServiceReturnObjType> {
        const returnObject: OperationsServiceReturnObjType = {
            error: false,
            redirect: null,
            operations: null
        };

        const {period, dateFrom, dateTo} = filter;
        const result: OperationsCategoriesResponse = await HttpUtils.request(  dateFrom && dateTo ? `/operations?period=${period}&dateFrom=${dateFrom}&dateTo=${dateTo}` :
            `/operations?period=${period}`);

        if (result.redirect || result.error || !result.response) {
            // (result.response && (result.response.error || !result.response.message || result.response.message))) {
            console.log('Возникла ошибка при запросе операций');
            if (result.redirect) {
                returnObject.redirect = result.redirect;  // перевод пользователя на другую страницу
            }
            return returnObject;
        }
        returnObject.operations = result.response;
        return returnObject;
    }

    public static async createOperation(data: CreateDataType): Promise<OperationsServiceReturnObjIdType> {
        const returnObject: OperationsServiceReturnObjIdType = {
            error: false,
            redirect: null,
            id: null
        };

        const result: OperationsCategoriesResponse = await HttpUtils.request('/operations', 'POST', true, data);

        if (result.redirect || result.error || !result.response ) {
            console.log('Возникла ошибка при добавлении операции');
            if (result.redirect) {
                returnObject.redirect = result.redirect;  // перевод пользователя на другую страницу
            }
            return returnObject;
        }
        returnObject.id = result.response.id;
        return returnObject;
    }

    public static async getOperation(id: string): Promise<OperationsServiceReturnObjType> {
        const returnObject: OperationsServiceReturnObjType = {
            error: false,
            redirect: null,
            operations: null
        };

        const result: OperationsCategoriesResponse = await HttpUtils.request('/operations/' + id);

        if (result.redirect || result.error || !result.response) {
            console.log('Возникла ошибка при запросе операции');
            if (result.redirect) {
                returnObject.redirect = result.redirect;  // перевод пользователя на другую страницу
            }
            return returnObject;
        }
        returnObject.operations = result.response;
        return returnObject;
    }

    public static async updateOperation(id: number, data: ChangeDataType): Promise<OperationsServiceReturnObjIdType> {
        const returnObject: OperationsServiceReturnObjIdType = {
            error: false,
            redirect: null,
            id: null
        };

        const result: OperationsCategoriesResponse = await HttpUtils.request('/operations/' + id, 'PUT', true, data);
        if (result.redirect || result.error || !result.response ) {
            console.log('Возникла ошибка при редактировании операции');
            if (result.redirect) {
                returnObject.redirect = result.redirect;  // перевод пользователя на другую страницу
            }
            return returnObject;
        }
        return returnObject;
    }

    public static async deleteOperation(id: string): Promise<OperationsServiceReturnObjDeleteType> {
        const returnObject: OperationsServiceReturnObjDeleteType = {
            error: false,
            redirect: null,
        };

        const result: OperationsCategoriesDeleteResponse = await HttpUtils.request('/operations/' + id, 'DELETE');

        if (result.redirect || result.error || !result.response ) {
            console.log('Возникла ошибка при удалении операции');
            if (result.redirect) {
                returnObject.redirect = result.redirect;  // перевод пользователя на другую страницу
            }
            return returnObject;
        }
        return returnObject;
    }
}