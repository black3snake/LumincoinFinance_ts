import {UrlUtils} from "../../utils/url-utils";
import {IncomeService} from "../../services/income-service";
import {OpenNewRouteHandlerType} from "../../types/open-new-route-handler.type";
import {IncomeServiceReturnObjDeleteType} from "../../types/income-service-return-obj.type";

export class IncomeDelete {
    readonly openNewRoute: OpenNewRouteHandlerType;

    constructor(openNewRoute: OpenNewRouteHandlerType) {
        this.openNewRoute = openNewRoute;
        const id: string | null = UrlUtils.getUrlParam('id');
        if (!id) {
            this.openNewRoute('/');
            return;
        }

        this.deleteIncome(id).then();
    }

    private async deleteIncome(id: string): Promise< void| null> {
        const response: IncomeServiceReturnObjDeleteType = await IncomeService.deleteIncome(id);

        if (response.error) {
            // alert(response.error);
            console.log(response.error);
            return response.redirect ? this.openNewRoute(response.redirect) : null;
        }

        return this.openNewRoute('/income');
    }
}