import {ValidationUtils} from "../../utils/validation-utils";
import {IncomeService} from "../../services/income-service";
import {OpenNewRouteHandlerType} from "../../types/open-new-route-handler.type";
import {ValidationsType} from "../../types/validations.type";
import {CreateDataType} from "../../types/create-data.type";
import {IncomeServiceReturnObjIdType} from "../../types/income-service-return-obj.type";

export class IncomeCreate {
    readonly openNewRoute: OpenNewRouteHandlerType;
    readonly incomeCreateInputElement: HTMLElement | null;
    readonly incomeCreateBtnElement: HTMLElement | null;
    readonly validations: ValidationsType[];

    constructor(openNewRoute: OpenNewRouteHandlerType) {
        this.openNewRoute = openNewRoute;

        this.incomeCreateInputElement = document.getElementById('incomeCreate_input');
        this.incomeCreateBtnElement = document.getElementById('incomeCreateBtn');

        if (this.incomeCreateBtnElement) {
            this.incomeCreateBtnElement.addEventListener('click', this.createIncome.bind(this));
        }

        this.validations = [
            {element: this.incomeCreateInputElement}
        ]

    }

    public async createIncome(e: Event): Promise<void|null> {
        e.preventDefault();

        if (ValidationUtils.validationForm(this.validations) && this.incomeCreateInputElement) {
            const createData: CreateDataType = {
                title: (this.incomeCreateInputElement as HTMLInputElement).value,
            }

            const response: IncomeServiceReturnObjIdType = await IncomeService.createIncome(createData);


            if (response.error) {
                // alert(response.error);
                console.log(response.error);
                return response.redirect ? this.openNewRoute(response.redirect) : null;
            }

            return this.openNewRoute('/income');
        }
    }

}