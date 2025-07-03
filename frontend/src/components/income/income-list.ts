import {IncomeService} from "../../services/income-service";
import {CreateEl} from "../../utils/create-el";
import {IncomeCategory, IncomeServiceReturnObjType} from "../../types/income-service-return-obj.type";
import {OpenNewRouteHandlerType} from "../../types/open-new-route-handler.type";

export class IncomeList {
    readonly openNewRoute: OpenNewRouteHandlerType;
    private incomeListContentElement: HTMLElement | null;
    private popupNotDeleteElement: HTMLElement | null;
    private popupContainerElement: HTMLElement | null;
    private popupDeleteElement: HTMLElement | null;

    constructor(openNewRoute: OpenNewRouteHandlerType) {
        this.openNewRoute = openNewRoute;
        this.incomeListContentElement = document.getElementById("incomeList_content");
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

        this.getIncomesList().then();

        document.querySelectorAll('.card_action .btn-danger').forEach(action => {
            action.addEventListener('click', () => {
                if (this.popupContainerElement) {
                    this.popupContainerElement.style.display = 'block';
                }
            })
        })

    }

    private async getIncomesList():Promise<void|null> {
        const response: IncomeServiceReturnObjType = await IncomeService.getIncomes();

        if (response.error) {
            // alert(response.error);
            console.log(response.error);
            return response.redirect ? this.openNewRoute(response.redirect) : null;
        }
        if (!response.incomes) {
            console.error('No incomes data received');
            return;
        }

        return this.showRecords(response.incomes);
    }

    public showRecords(incomes:IncomeCategory): void {
        if (incomes && Array.isArray(incomes)) {
            for (let i = 0; i < incomes.length; i++) {
                if (this.incomeListContentElement) {
                    this.incomeListContentElement.appendChild(CreateEl.createElementsList(incomes[i], '/income'));
                }
            }
            if (this.incomeListContentElement) {
                this.incomeListContentElement.appendChild(CreateEl.createElementNew('/income/create'));
            }
        }
    }
}