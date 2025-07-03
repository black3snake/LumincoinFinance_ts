import {UrlUtils} from "../../utils/url-utils";
import {OperationsService} from "../../services/operations-service";
import {OpenNewRouteHandlerType} from "../../types/open-new-route-handler.type";
import {OperationsServiceReturnObjDeleteType} from "../../types/operations-service-return-obj.type";

export class IncomeExpensesDelete {
    readonly openNewRoute: OpenNewRouteHandlerType;

    constructor(openNewRoute: OpenNewRouteHandlerType) {
        this.openNewRoute = openNewRoute;


        const id: string | null = UrlUtils.getUrlParam('id');
        if (!id) {
            this.openNewRoute('/');
            return;
        }

        this.deleteOperation(id).then();
    }

    async deleteOperation(id: string): Promise<void|null> {
        const response: OperationsServiceReturnObjDeleteType = await OperationsService.deleteOperation(id);

        if (response.error) {
            // alert(response.error);
            console.log(response.error);
            return response.redirect ? this.openNewRoute(response.redirect) : null;
        }

        return this.openNewRoute('/income-expenses');
    }
}