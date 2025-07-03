import {UrlUtils} from "../../utils/url-utils";
import {IncomeService} from "../../services/income-service";
import {ValidationUtils} from "../../utils/validation-utils";
import {OpenNewRouteHandlerType} from "../../types/open-new-route-handler.type";
import {ValidationsType} from "../../types/validations.type";
import {
    IncomeCategory,
    IncomeServiceReturnObjType
} from "../../types/income-service-return-obj.type";
import {ChangeDataType} from "../../types/change-data.type";

export class IncomeEdit {
    readonly openNewRoute: OpenNewRouteHandlerType;
    private incomeEditInputElement: HTMLElement | null;
    private validations: ValidationsType[] = [];
    private incomeEditSaveBtnElement: HTMLElement | null;
    private incomeOriginalData: IncomeCategory | null = null;

    constructor(openNewRoute: OpenNewRouteHandlerType) {
        this.openNewRoute = openNewRoute;
        this.incomeEditInputElement = document.getElementById('incomeEdit_input');
        this.incomeEditSaveBtnElement = document.getElementById('incomeEditSaveBtn')


        const id: string|null = UrlUtils.getUrlParam('id');
        if (!id) {
            this.openNewRoute('/');
            return;
        }
        if (this.incomeEditSaveBtnElement) {
            this.incomeEditSaveBtnElement.addEventListener('click', this.updateIncome.bind(this));
        }

        this.validations = [
            {element: this.incomeEditInputElement}
        ]
        this.init(id).then();
    }

    private async init(id: string): Promise<void> {
        const incomeData: IncomeCategory | null | void = await this.getIncome(id);
        if (incomeData) {
            this.showIncome(incomeData);
            // if (orderData.freelancer) {
            //     await this.getFreelancers(orderData.freelancer.id);
            // }
        }
    }

    public async getIncome(id:string): Promise<IncomeCategory| null | void> {
        const response: IncomeServiceReturnObjType = await IncomeService.getIncome(id);

        if (response.error) {
            // alert(response.error);
            console.log(response.error);
            return response.redirect ? this.openNewRoute(response.redirect ) : null;
        }

        this.incomeOriginalData = response.incomes;
        return response.incomes;
    }

    private showIncome(income: IncomeCategory): void {
        if (this.incomeEditInputElement) {
            (this.incomeEditInputElement as HTMLInputElement).value = income.title;
        }
    }

    public async updateIncome(e: Event): Promise<void | null> {
        e.preventDefault();

        if (ValidationUtils.validationForm(this.validations)) {
            const changedData: ChangeDataType = {title:''};

            if (this.incomeEditInputElement && this.incomeOriginalData) {
                if ((this.incomeEditInputElement as HTMLInputElement).value !== this.incomeOriginalData.title) {
                    changedData.title = (this.incomeEditInputElement as HTMLInputElement).value;
                }
            }

            if (Object.keys(changedData).length > 0 && this.incomeOriginalData) {
                const response: IncomeServiceReturnObjType = await IncomeService.updateIncome(this.incomeOriginalData.id, changedData);

                if (response.error) {
                    // alert(response.error);
                    console.log(response.error);
                    return response.redirect ? this.openNewRoute(response.redirect) : null;
                }

                return this.openNewRoute('/income');
            }
        }
    }
}
