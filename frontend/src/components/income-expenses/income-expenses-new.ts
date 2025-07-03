import {UrlUtils} from "../../utils/url-utils";
import {ValidationUtils} from "../../utils/validation-utils";
import {IncomeService} from "../../services/income-service";
import {ExpensesService} from "../../services/expenses-service";
import {OperationsService} from "../../services/operations-service";
import moment from "moment";
import {OpenNewRouteHandlerType} from "../../types/open-new-route-handler.type";
import {ValidationsType} from "../../types/validations.type";
import {DatePikOptionType} from "../../types/date-pik-option.type";
import {IncomeCategory, IncomeServiceReturnObjType} from "../../types/income-service-return-obj.type";
import {ExpensesServiceReturnObjType} from "../../types/expenses-service-return-obj.type";
import {CreateDataType} from "../../types/create-data.type";
import {OperationsServiceReturnObjIdType} from "../../types/operations-service-return-obj.type";

export class IncomeExpensesNew {
    readonly openNewRoute: OpenNewRouteHandlerType;
    private typeSelectElement: HTMLElement | null;
    private categorySelectElement: HTMLElement | null;
    private amountElement: HTMLElement | null;
    private dateElement: HTMLElement | null;
    private commentElement: HTMLElement | null;
    private validations: ValidationsType[] = [];
    private incomeExpensesNewDate: string | null;
    private incomeExpensesNewCreateBtnElement: HTMLElement | null;

    constructor(openNewRoute: OpenNewRouteHandlerType) {
        this.openNewRoute = openNewRoute;
        this.typeSelectElement = document.getElementById('incomeExpensesNew_typeSelect');
        this.categorySelectElement = document.getElementById('incomeExpensesNew_categorySelect');
        this.amountElement = document.getElementById('incomeExpensesNew_amount');
        this.dateElement = document.getElementById('incomeExpensesNew_date');
        this.commentElement = document.getElementById('incomeExpensesNew_comment');
        this.incomeExpensesNewCreateBtnElement = document.getElementById('incomeExpensesNewCreateBtn')
        this.incomeExpensesNewDate = null;

        const path: string | null = UrlUtils.getUrlParam('path');
        if (!path) {
            this.openNewRoute('/income-expenses');
            return;
        }

        this.validations = [
            {element: this.categorySelectElement},
            {element: this.amountElement},
            {element: this.dateElement},
            {element: this.commentElement},
        ]


        const datePikOption: DatePikOptionType = {
            format: 'dd.mm.yyyy',
            autoclose: true,
            language: "ru"
        }
        $('#incomeExpensesNew_date').datepicker(datePikOption).on('changeDate', (e: DatepickerChangeDateEventInterface) => {
            this.incomeExpensesNewDate = moment(e.date).format('YYYY-MM-DD');
            console.log(this.incomeExpensesNewDate);
        });


        this.init(path);

        if (this.incomeExpensesNewCreateBtnElement) {
            this.incomeExpensesNewCreateBtnElement.addEventListener('click', this.saveOperation.bind(this));
        }
    }

    private init(path: string): void {
        // отключим первый select
        ['click', 'mousedown', 'keydown', 'focus'].forEach(evt => {
            if (this.typeSelectElement) {
                this.typeSelectElement.addEventListener(evt, e => {
                    e.preventDefault();
                    e.stopPropagation();
                });
            }
        });

        // заполним поля
        if (this.typeSelectElement) {
            for (let i = 0; i < (this.typeSelectElement as HTMLSelectElement).options.length; i++) {
                if ((this.typeSelectElement as HTMLSelectElement).options[i].value === path) {
                    (this.typeSelectElement as HTMLSelectElement).selectedIndex = i;
                }
            }
        }
        if (path.includes('income')) {
            this.getIncomes().then();
        } else {
            this.getExpenses().then();
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

    private async getExpenses(): Promise<void | null> {
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
                const option:HTMLOptionElement = document.createElement("option");
                option.value = response.expenses[i].id.toString();
                option.innerText = response.expenses[i].title;
                if (this.categorySelectElement) {
                    this.categorySelectElement.appendChild(option);
                }
            }
        }
    }

    private async saveOperation(e: Event): Promise<void | null> {
        e.preventDefault();

        if (ValidationUtils.validationForm(this.validations) && this.typeSelectElement && this.amountElement &&
            this.commentElement && this.categorySelectElement) {
            const createData: CreateDataType = {
                type: (this.typeSelectElement as HTMLSelectElement).value,
                amount: parseInt((this.amountElement as HTMLInputElement).value),
                date: this.incomeExpensesNewDate,
                comment: (this.commentElement as HTMLInputElement).value,
                category_id: parseInt((this.categorySelectElement as HTMLSelectElement).value)
            };

            const response: OperationsServiceReturnObjIdType = await OperationsService.createOperation(createData);

            if (response.error) {
                // alert(response.error);
                console.log(response.error);
                return response.redirect ? this.openNewRoute(response.redirect) : null;
            }

            return this.openNewRoute('/income-expenses');

        }
    }

}