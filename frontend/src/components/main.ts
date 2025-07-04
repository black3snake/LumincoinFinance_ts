import {Chart, PieController, ArcElement, Tooltip, Legend, Title} from "chart.js";
import moment from "moment/moment";
import {IncomeService} from "../services/income-service";
import {ExpensesService} from "../services/expenses-service";
import {OperationsService} from "../services/operations-service";
import {OpenNewRouteHandlerType} from "../types/open-new-route-handler.type";
import {PeriodDateType} from "../types/period-date.type";
import {DatePikOptionType} from "../types/date-pik-option.type";
import {DataForChartType} from "../types/data-for-chart.type";
import {IncomeCategory, IncomeServiceReturnObjType} from "../types/income-service-return-obj.type";
import {ExpensesCategory, ExpensesServiceReturnObjType} from "../types/expenses-service-return-obj.type";
import {OperationsServiceReturnObjType} from "../types/operations-service-return-obj.type";

export class Main {
    readonly openNewRoute: OpenNewRouteHandlerType;
    private ctxLeft: HTMLElement | null;
    private ctxRight: HTMLElement | null;
    private intervalInputElement: HTMLElement | null;
    private startDateElement: JQuery<HTMLElement>;
    private endDateElement: JQuery<HTMLElement>;
    private periodDate: PeriodDateType;
    private startDate: Date | null;
    private endDate: Date | null;
    private dataForChart: DataForChartType;
    private myPieChartL: Chart<'pie'> | null = null;
    private myPieChartR: Chart<'pie'> | null = null;


    constructor(openNewRoute: OpenNewRouteHandlerType) {
        this.openNewRoute = openNewRoute;

        this.ctxLeft = document.getElementById('myPieChart-left');
        if (this.ctxLeft) {
            (this.ctxLeft as HTMLCanvasElement).getContext('2d');
        }

        this.ctxRight = document.getElementById('myPieChart-right');
        if (this.ctxRight) {
            (this.ctxRight as HTMLCanvasElement).getContext('2d');
        }

        this.intervalInputElement = document.getElementById('btnradio5');
        this.startDateElement = $('#startDate');
        this.endDateElement = $('#endDate');

        const than = this;
        document.querySelectorAll('.main_switch input.btn-check').forEach(item => {
            item.addEventListener('click', (e) => {
                if ((e.target as HTMLInputElement).checked) {
                    // console.log(e.target);
                    // console.log(item.nextElementSibling.innerText);
                    if (item.nextElementSibling) {
                        if (!(item.nextElementSibling as HTMLInputElement).innerText.includes('Интервал')) {
                            than.startDateElement.val('');
                            than.endDateElement.val('');
                            than.getOperations(than.funcFilter((item.nextElementSibling as HTMLInputElement).innerText)).then();
                        }
                    }
                }
            })
        });

        this.periodDate = {
            period: 'year',
            dateFrom: null,
            dateTo: null,
        }


        this.startDate = null;
        this.endDate = null;
        const datePikOption: DatePikOptionType = {
            format: 'dd.mm.yyyy',
            autoclose: true,
            language: "ru"
        }
        this.startDateElement.datepicker(datePikOption).on('changeDate', (e: DatepickerChangeDateEventInterface) => {
            if (this.intervalInputElement) {
                if ((this.intervalInputElement as HTMLInputElement).checked) {
                    this.endDateElement.datepicker('setStartDate', e.date);
                    this.startDate = e.date;
                    // console.log(this.startDate);
                    if (this.startDate && this.endDate) {
                        this.periodDate.dateFrom = moment(this.startDate).format('YYYY-MM-DD');
                        this.periodDate.dateTo = moment(this.endDate).format('YYYY-MM-DD');
                        this.getOperations(this.funcFilter('Интервал')).then();
                    }
                } else {
                    this.startDateElement.val('');
                }
            }
        });

        this.endDateElement.datepicker(datePikOption).on('changeDate', (e: DatepickerChangeDateEventInterface) => {
            if (this.intervalInputElement) {
                if ((this.intervalInputElement as HTMLInputElement).checked) {
                    this.endDateElement.datepicker('setEndDate', e.date);
                    this.endDate = e.date;
                    // console.log(this.endDate.toISOString());
                    if (this.startDate && this.endDate) {
                        this.periodDate.dateFrom = moment(this.startDate).format('YYYY-MM-DD');
                        this.periodDate.dateTo = moment(this.endDate).format('YYYY-MM-DD');
                        this.getOperations(this.funcFilter('Интервал')).then();
                    }
                } else {
                    this.endDateElement.val('');
                }
            }
        });

        // data for Chart
        this.dataForChart = {
            incomesTitle: [],
            incomesData: [],
            expensesTitle: [],
            expensesData: [],
            color_rgb: [
                'rgb(249,1,1)',
                'rgb(9,170,74)',
                'rgb(0,88,255)',
                'rgb(0,0,0)',
                'rgb(255,255,255)',
                'rgb(176,176,176)',
                'rgb(255,109,2)',
                'rgb(246,187,80)',
                'rgb(251,158,158)',
                'rgb(119,49,49)',
                'rgba(153, 102, 255, 0.8)',
                'rgb(255,0,255)',
            ],
            operationIncomes: [],
            operationExpenses: [],
        }

        this.init().then();

    }

    private async init(): Promise<void> {
        const incomeData: IncomeCategory | null | void = await this.getIncomes();
        const expenseData: ExpensesCategory | null | void = await this.getExpenses();
        if (incomeData && expenseData && Array.isArray(incomeData) && Array.isArray(expenseData) ) {
            this.dataForChart.incomesTitle = incomeData.map(item => item.title);
            this.dataForChart.expensesTitle = expenseData.map(item => item.title);
        }

        // console.log(this.dataForChart.incomesTitle);
        // console.log(this.dataForChart.expensesTitle);

        this.getOperations().then();
    }

    private funcFillData(): void {
        this.dataForChart.incomesData = [];
        this.dataForChart.expensesData = [];
        for (let i = 0; i < this.dataForChart.incomesTitle.length; i++) {
            let item = 0;
            for (let j = 0; j < this.dataForChart.operationIncomes.length; j++) {
                if (this.dataForChart.incomesTitle[i] === this.dataForChart.operationIncomes[j].category) {
                    item += parseInt(this.dataForChart.operationIncomes[j].amount);
                }
            }
            this.dataForChart.incomesData.push(item);
        }

        for (let i = 0; i < this.dataForChart.expensesTitle.length; i++) {
            let item = 0;
            for (let j = 0; j < this.dataForChart.operationExpenses.length; j++) {
                if (this.dataForChart.expensesTitle[i] === this.dataForChart.operationExpenses[j].category) {
                    item += parseInt(this.dataForChart.operationExpenses[j].amount);
                }
            }
            this.dataForChart.expensesData.push(item);
        }
    }

    private async getIncomes(): Promise<IncomeCategory | null | void> {
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

        return response.incomes
    }

    private async getExpenses(): Promise<ExpensesCategory | null | void> {
        const response: ExpensesServiceReturnObjType = await ExpensesService.getExpenses();

        if (response.error) {
            // alert(response.error);
            console.log(response.error);
            return response.redirect ? this.openNewRoute(response.redirect) : null;
        }
        if (!response.expenses) {
            console.error('No expenses data received');
            return;
        }

        return response.expenses;
    }

    private funcFilter(action: string): PeriodDateType {
        switch (action) {
            case 'Сегодня':
                this.periodDate.period = '';
                break;
            case 'Неделя':
                this.periodDate.period = 'week';
                break;
            case 'Месяц':
                this.periodDate.period = 'month';
                break;
            case 'Год':
                this.periodDate.period = 'year'
                break;
            case 'Все':
                this.periodDate.period = 'all'
                break;
            case 'Интервал':
                this.periodDate.period = 'interval';
                break;
        }
        return this.periodDate;
    }

    private async getOperations(filter: PeriodDateType = this.periodDate): Promise<void | null> {
        const response: OperationsServiceReturnObjType = await OperationsService.getOperations(filter);
        if (response.error) {
            // alert(response.error);
            console.log(response.error);
            return response.redirect ? this.openNewRoute(response.redirect) : null;
        }

        if (response.operations && Array.isArray(response.operations) ) {
            this.dataForChart.operationIncomes = response.operations.filter(item => item.type === 'income');
            this.dataForChart.operationExpenses = response.operations.filter(item => item.type === 'expense');

            await this.funcFillData();
        }


        // console.log(this.dataForChart.incomesData);
        // console.log(this.dataForChart.expensesData);

        this.showChart(this.dataForChart);
    }


    showChart(objectData: DataForChartType) {
        this.myPieChartL ? this.myPieChartL.destroy() : null;
        this.myPieChartR ? this.myPieChartR.destroy() : null;

        const dataIncomes = {
            labels: objectData.incomesTitle,
            // ['Красный', 'Синий', 'Желтый', 'Зеленый', 'Фиолетовый'],
            datasets: [{
                data: objectData.incomesData,
                backgroundColor: objectData.color_rgb.slice(0, objectData.incomesData.length),
                borderWidth: 1
            }],
        };
        const dataExpenses = {
            labels: objectData.expensesTitle,
            datasets: [{
                data: objectData.expensesData,
                backgroundColor: objectData.color_rgb.slice(0, objectData.expensesData.length),
                borderWidth: 1
            }],
        };

        const legend = {
            display: true,
            position: 'top',
            labels: {
                boxWidth: 12,
                boxHeight: 12,
                color: '#000', // цвет текста
                font: {
                    size: 12, // размер шрифта
                    family: "'Roboto Medium', sans-serif",
                },
                padding: 0,
            },

        }

        const configIncomes = {
            type: 'pie',
            data: dataIncomes,
            options: {
                responsive: true,
                plugins: {
                    legend: legend,
                    // title: title
                }
            },
        };
        const configExpenses = {
            type: 'pie',
            data: dataExpenses,
            options: {
                responsive: true,
                plugins: {
                    legend: legend,
                    // title: title
                }
            },
        };

        Chart.register(PieController, ArcElement, Tooltip, Legend, Title);
        this.myPieChartL = new Chart((this.ctxLeft as HTMLCanvasElement), configIncomes as any);
        this.myPieChartR = new Chart((this.ctxRight as HTMLCanvasElement), configExpenses as any);
    }

}