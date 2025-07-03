import moment from "moment/moment";
import {UrlUtils} from "../../utils/url-utils";
import {IncomeService} from "../../services/income-service";
import {ExpensesService} from "../../services/expenses-service";
import {OperationsService} from "../../services/operations-service";
import {ValidationUtils} from "../../utils/validation-utils";
import {ChangeDataType} from "../../types/change-data.type";
import {OpenNewRouteHandlerType} from "../../types/open-new-route-handler.type";
import {DatePikOptionType} from "../../types/date-pik-option.type";
import {ValidationsType} from "../../types/validations.type";
import {
    OperationsCategory, OperationsServiceReturnObjIdType,
    OperationsServiceReturnObjType,
} from "../../types/operations-service-return-obj.type";
import {IncomeServiceReturnObjType} from "../../types/income-service-return-obj.type";
import {ExpensesServiceReturnObjType} from "../../types/expenses-service-return-obj.type";

export class IncomeExpensesEdit {
    readonly openNewRoute: OpenNewRouteHandlerType;
    private calendarElement: JQuery<HTMLElement>;
    private incomeExpensesEditDate: string | null;
    private typeSelectElement: HTMLElement | null;
    private categorySelectElement: HTMLElement | null;
    private amountElement: HTMLElement | null;
    private dateElement: HTMLElement | null;
    private commentElement: HTMLElement | null;
    private validations: ValidationsType[] = [];
    private operation: OperationsCategory | null = null;

    constructor(openNewRoute: OpenNewRouteHandlerType) {
        this.openNewRoute = openNewRoute;

        this.calendarElement = $('#incomeExpensesEdit_date');
        this.incomeExpensesEditDate = null;
        this.typeSelectElement = document.getElementById('incomeExpensesEdit_typeSelect');
        this.categorySelectElement = document.getElementById('incomeExpensesEdit_categorySelect');
        this.amountElement = document.getElementById('incomeExpensesEdit_amount');
        this.dateElement = document.getElementById('incomeExpensesEdit_date');
        this.commentElement = document.getElementById('incomeExpensesEdit_comment');

        const id: string | null = UrlUtils.getUrlParam('id');
        if (!id) {
            this.openNewRoute('/income-expenses');
            return;
        }

        const datePikOption: DatePikOptionType = {
            format: 'dd.mm.yyyy',
            autoclose: true,
            language: "ru"
        }
        this.calendarElement.datepicker(datePikOption).on('changeDate', (e: DatepickerChangeDateEventInterface) => {
            this.incomeExpensesEditDate = moment(e.date).format('YYYY-MM-DD');
            console.log(this.incomeExpensesEditDate);
        });

        this.validations = [
            {element: this.categorySelectElement},
            {element: this.amountElement},
            {element: this.dateElement},
            {element: this.commentElement},
        ]

        this.init(id).then();

        const incomeExpensesEditSaveBtn: HTMLElement | null = document.getElementById('incomeExpensesEditSaveBtn')
        if (incomeExpensesEditSaveBtn) {
            incomeExpensesEditSaveBtn.addEventListener('click', this.updateOperation.bind(this));
        }
    }

    private async init(id: string): Promise<void> {
        // отключим первый select
        ['click', 'mousedown', 'keydown', 'focus'].forEach(evt => {
            if (this.typeSelectElement) {
                this.typeSelectElement.addEventListener(evt, e => {
                    e.preventDefault();
                    e.stopPropagation();
                });
            }
        });

        const result: void | OperationsCategory | null = await this.getOperation(id);
        if (result !== undefined) {
            this.operation = result;
        }

        // заполним поля
        if (this.typeSelectElement && this.operation) {
            for (let i = 0; i < (this.typeSelectElement as HTMLSelectElement).options.length; i++) {
                if ((this.typeSelectElement as HTMLSelectElement).options[i].value === this.operation.type) {
                    (this.typeSelectElement as HTMLSelectElement).selectedIndex = i;
                }
            }
        }

        if (this.operation) {
            if (this.operation.type.includes('income')) {
                await this.getIncomes().then();
            } else {
                await this.getExpenses().then();
            }
        }

        if (this.categorySelectElement && this.operation) {
            for (let i = 0; i < (this.categorySelectElement as HTMLSelectElement).options.length; i++) {
                if ((this.categorySelectElement as HTMLSelectElement).options[i].innerText === this.operation.category) {
                    (this.categorySelectElement as HTMLSelectElement).selectedIndex = i;
                }
            }
        }

        if (this.amountElement && this.operation && this.commentElement) {
            (this.amountElement as HTMLInputElement).value = this.operation.amount.toString();
            (this.commentElement as HTMLInputElement).value = this.operation.comment;
            this.calendarElement.datepicker('setDate', new Date(this.operation.date));
        }
    }

    private async getIncomes(): Promise<void | null> {
        const response: IncomeServiceReturnObjType = await IncomeService.getIncomes();

        if (response.error) {
            // alert(response.error);
            console.log(response.error);
            return response.redirect ? this.openNewRoute(response.redirect) : null;
        }

        const option0 = new Option("Категория...", "", true, true);
        option0.hidden = true;
        option0.disabled = true;
        if (this.categorySelectElement) {
            this.categorySelectElement.insertBefore(option0, this.categorySelectElement.firstChild);
        }

        if (response.incomes && Array.isArray(response.incomes)) {
            for (let i = 0; i < response.incomes.length; i++) {
                const option: HTMLElement | null = document.createElement("option");
                (option as HTMLSelectElement).value = response.incomes[i].id.toString();
                option.innerText = response.incomes[i].title;
                if (this.categorySelectElement) {
                    this.categorySelectElement.appendChild(option);
                }
            }
        }
    }

    private async getExpenses(): Promise<void|null> {
        const response: ExpensesServiceReturnObjType = await ExpensesService.getExpenses();

        if (response.error) {
            // alert(response.error);
            console.log(response.error);
            return response.redirect ? this.openNewRoute(response.redirect) : null;
        }

        const option0 = new Option("Категория...", "", true, true);
        option0.hidden = true;
        option0.disabled = true;
        if (this.categorySelectElement) {
            this.categorySelectElement.insertBefore(option0, this.categorySelectElement.firstChild);
        }
        if (response.expenses && Array.isArray(response.expenses)) {
            for (let i = 0; i < response.expenses.length; i++) {
                const option: HTMLElement | null = document.createElement("option");
                (option as HTMLSelectElement).value = response.expenses[i].id.toString();
                option.innerText = response.expenses[i].title;
                if (this.categorySelectElement) {
                    this.categorySelectElement.appendChild(option);
                }
            }
        }
    }

    private async getOperation(id: string): Promise<OperationsCategory | void | null> {
        const response: OperationsServiceReturnObjType = await OperationsService.getOperation(id);

        if (response.error) {
            // alert(response.error);
            console.log(response.error);
            return response.redirect ? this.openNewRoute(response.redirect) : null;
        }
        if (!response.operations ) {
            console.error('No operations data received');
            return;
        }

        return response.operations;
    }

    public async updateOperation(e: Event): Promise<void|null> {
        e.preventDefault();

        if (ValidationUtils.validationForm(this.validations) && this.operation && this.categorySelectElement) {
            const changedData: ChangeDataType = {
                type: this.operation.type,
                amount: this.operation.amount,
                date: this.incomeExpensesEditDate,
                comment: this.operation.comment,
                category_id: parseInt((this.categorySelectElement as HTMLSelectElement).value)
            };

            // select
            if (this.typeSelectElement) {
                if ((this.typeSelectElement as HTMLSelectElement).value !== this.operation.type) {
                    changedData.type = (this.typeSelectElement as HTMLSelectElement).value;
                }
            }

            if ((this.categorySelectElement as HTMLSelectElement).options[(this.categorySelectElement as HTMLSelectElement).selectedIndex].innerText !== this.operation.category) {
                changedData.category_id = parseInt((this.categorySelectElement as HTMLSelectElement).value);
            }

            // amount
            if (this.amountElement) {
                if (parseInt((this.amountElement as HTMLInputElement).value) !== this.operation.amount) {
                    changedData.amount = parseInt((this.amountElement as HTMLInputElement).value);
                }
            }
            // calendar  new Date(this.operation.date)
            if (this.incomeExpensesEditDate) {
                changedData.date = this.incomeExpensesEditDate;
            }
            // comment
            if (this.commentElement) {
                if ((this.commentElement as HTMLInputElement).value !== this.operation.comment) {
                    changedData.comment = (this.commentElement as HTMLInputElement).value;
                }
            }

            if (Object.keys(changedData).length > 0) {
                const response: OperationsServiceReturnObjIdType = await OperationsService.updateOperation(this.operation.id, changedData);

                if (response.error) {
                    // alert(response.error);
                    console.log(response.error);
                    return response.redirect ? this.openNewRoute(response.redirect) : null;
                }

                return this.openNewRoute('/income-expenses');
            }
        }
    }
}