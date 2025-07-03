import {UrlUtils} from "../../utils/url-utils";
import {ExpensesService} from "../../services/expenses-service";
import {ValidationUtils} from "../../utils/validation-utils";
import {OpenNewRouteHandlerType} from "../../types/open-new-route-handler.type";
import {ValidationsType} from "../../types/validations.type";
import {ExpensesCategory, ExpensesServiceReturnObjType} from "../../types/expenses-service-return-obj.type";
import {ChangeDataType} from "../../types/change-data.type";

export class ExpensesEdit {
    readonly openNewRoute: OpenNewRouteHandlerType;
    private expenseEditInputElement: HTMLElement | null;
    private expenseEditSaveBtnElement: HTMLElement | null;
    private validations: ValidationsType[] = [];
    private expenseOriginalData: ExpensesCategory | null = null;

    constructor(openNewRoute: OpenNewRouteHandlerType) {
        this.openNewRoute = openNewRoute;

        this.expenseEditInputElement = document.getElementById('expenseEdit_input');
        this.expenseEditSaveBtnElement = document.getElementById('expenseEditSaveBtn')

        const id: string | null = UrlUtils.getUrlParam('id');
        if (!id) {
            this.openNewRoute('/');
            return
        }

        if (this.expenseEditSaveBtnElement) {
            this.expenseEditSaveBtnElement.addEventListener('click', this.updateExpense.bind(this));
        }

        this.validations = [
            {element: this.expenseEditInputElement}
        ]
        this.init(id).then();
    }

    private async init(id: string): Promise<void> {
        const expenseData: ExpensesCategory | null | void  = await this.getExpense(id);
        if (expenseData) {
            this.showExpense(expenseData);
        }
    }

    private async getExpense(id: string): Promise<ExpensesCategory| void | null> {
        const response: ExpensesServiceReturnObjType = await ExpensesService.getExpense(id);

        if (response.error) {
            // alert(response.error);
            console.log(response.error);
            return response.redirect ? this.openNewRoute(response.redirect) : null;
        }

        if (!response.expenses) {
            console.error('No expenses data received');
            return;
        }

        this.expenseOriginalData = response.expenses;
        return response.expenses;
    }

    private showExpense(expense: ExpensesCategory): void {
        if (this.expenseEditInputElement) {
            (this.expenseEditInputElement as HTMLInputElement).value = expense.title;
        }
    }

    private async updateExpense(e: Event): Promise<void | null> {
        e.preventDefault();

        if (ValidationUtils.validationForm(this.validations)) {
            const changedData: ChangeDataType = {title: ''};

            if (this.expenseEditInputElement && this.expenseOriginalData) {
                if ((this.expenseEditInputElement as HTMLInputElement).value !== this.expenseOriginalData.title) {
                    changedData.title = (this.expenseEditInputElement as HTMLInputElement).value;
                }
            }

            if (Object.keys(changedData).length > 0 && this.expenseOriginalData) {
                const response: ExpensesServiceReturnObjType = await ExpensesService.updateExpense(this.expenseOriginalData.id, changedData);

                if (response.error) {
                    // alert(response.error);
                    console.log(response.error);
                    return response.redirect ? this.openNewRoute(response.redirect) : null;
                }

                return this.openNewRoute('/expenses');
            }
        }
    }

}