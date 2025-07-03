import {CreateEl} from "../../utils/create-el";
import {ExpensesService} from "../../services/expenses-service";
import {OpenNewRouteHandlerType} from "../../types/open-new-route-handler.type";
import {
    ExpensesCategory,
    ExpensesServiceReturnObjType
} from "../../types/expenses-service-return-obj.type";

export class ExpensesList {
    readonly openNewRoute: OpenNewRouteHandlerType;
    private expensesListContentElement: HTMLElement | null;
    private popupDeleteElement: HTMLElement | null;
    private popupNotDeleteElement: HTMLElement | null;
    private popupContainerElement: HTMLElement | null;
    
    constructor(openNewRoute: OpenNewRouteHandlerType) {
        this.openNewRoute = openNewRoute;
        this.expensesListContentElement = document.getElementById("expensesList_content");
        this.popupDeleteElement = document.getElementById("popupDelete");
        this.popupNotDeleteElement = document.getElementById("popupNotDelete");
        this.popupContainerElement = document.getElementById("popupContainer");

        if (this.popupDeleteElement) {
            this.popupDeleteElement.addEventListener("click", () => {
                if (this.popupContainerElement) {
                    this.popupContainerElement.style.display = 'none';
                }
            })
        }

        if (this.popupNotDeleteElement) {
            this.popupNotDeleteElement.addEventListener("click", () => {
                if (this.popupContainerElement) {
                    this.popupContainerElement.style.display = 'none';
                }
            })
        }


        this.getExpensesList().then();

        document.querySelectorAll('.card_action .btn-danger').forEach(action => {
            action.addEventListener('click', () => {
                if (this.popupContainerElement) {
                    this.popupContainerElement.style.display = 'block';
                }
            })
        })

    }

    private async getExpensesList(): Promise<void|null> {
        const response: ExpensesServiceReturnObjType  = await ExpensesService.getExpenses();

        if (response.error) {
            // alert(response.error);
            console.log(response.error);
            return response.redirect ? this.openNewRoute(response.redirect) : null;
        }
        if (!response.expenses) {
            console.error('No expenses data received');
            return;
        }
        return this.showRecords(response.expenses);
    }

    private showRecords(expenses: ExpensesCategory): void {
        if (expenses && Array.isArray(expenses)) {
            for (let i = 0; i < expenses.length; i++) {
                if (this.expensesListContentElement) {
                    this.expensesListContentElement.appendChild(CreateEl.createElementsList(expenses[i], '/expenses'));
                }
            }
            if (this.expensesListContentElement) {
                this.expensesListContentElement.appendChild(CreateEl.createElementNew('/expenses/create'));
            }
        }
    }
}