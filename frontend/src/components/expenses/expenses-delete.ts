import {UrlUtils} from "../../utils/url-utils";
import {ExpensesService} from "../../services/expenses-service";
import {OpenNewRouteHandlerType} from "../../types/open-new-route-handler.type";
import {ExpensesServiceReturnObjDeleteType} from "../../types/expenses-service-return-obj.type";

export class ExpensesDelete {
    readonly openNewRoute: OpenNewRouteHandlerType;

    constructor(openNewRoute: OpenNewRouteHandlerType) {
        this.openNewRoute = openNewRoute;

        const id: string | null = UrlUtils.getUrlParam('id');
        if (!id) {
            this.openNewRoute('/');
            return;
        }

        this.deleteExpense(id).then();
    }

    private async deleteExpense(id: string): Promise<void| null> {
        const response: ExpensesServiceReturnObjDeleteType = await ExpensesService.deleteExpense(id);

        if (response.error) {
            // alert(response.error);
            console.log(response.error);
            return response.redirect ? this.openNewRoute(response.redirect) : null;
        }

        return this.openNewRoute('/expenses');
    }
}