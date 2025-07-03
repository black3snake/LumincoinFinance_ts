import {ValidationUtils} from "../../utils/validation-utils";
import {ExpensesService} from "../../services/expenses-service";
import {OpenNewRouteHandlerType} from "../../types/open-new-route-handler.type";
import {ValidationsType} from "../../types/validations.type";
import {CreateDataType} from "../../types/create-data.type";
import {
    ExpensesServiceReturnObjIdType,
} from "../../types/expenses-service-return-obj.type";

export class ExpensesCreate {
    readonly openNewRoute: OpenNewRouteHandlerType;
    private expenseCreateInputElement: HTMLElement | null;
    private expenseCreateBtnElement: HTMLElement | null;
    private validations: ValidationsType[] = [];

    constructor(openNewRoute: OpenNewRouteHandlerType) {
        this.openNewRoute = openNewRoute;
        this.expenseCreateInputElement = document.getElementById('expenseCreate_input');
        this.expenseCreateBtnElement = document.getElementById('expenseCreateBtn')

        if (this.expenseCreateBtnElement) {
            this.expenseCreateBtnElement.addEventListener('click', this.createExpense.bind(this));
        }

        this.validations = [
            {element: this.expenseCreateInputElement}
        ]
    }

    public async createExpense(e: Event): Promise<void | null> {
        e.preventDefault();

        if (ValidationUtils.validationForm(this.validations) && this.expenseCreateInputElement) {
            const createData: CreateDataType = {
                title: (this.expenseCreateInputElement as HTMLInputElement).value,
            }

            const response: ExpensesServiceReturnObjIdType = await ExpensesService.createExpense(createData);

            if (response.error) {
                // alert(response.error);
                console.log(response.error);
                return response.redirect ? this.openNewRoute(response.redirect) : null;
            }

            return this.openNewRoute('/expenses');
        }
    }
}