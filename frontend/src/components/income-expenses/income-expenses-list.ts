// import DataTable from 'datatables.net-dt';
import {CommonUtils} from "../../utils/common-utils";
import {OperationsService} from "../../services/operations-service";
import moment from "moment";
import {OpenNewRouteHandlerType} from "../../types/open-new-route-handler.type";
import {DatePikOptionType} from "../../types/date-pik-option.type";
import {PeriodDateType} from "../../types/period-date.type";
import {OperationsCategory, OperationsServiceReturnObjType} from "../../types/operations-service-return-obj.type";

export class IncomeExpensesList {
    readonly openNewRoute: OpenNewRouteHandlerType;
    private createIncomeElement: HTMLElement | null;
    private createExpenseElement: HTMLElement | null;
    private intervalInputElement: HTMLElement | null;
    private DT: JQuery
    private startDateElement: JQuery<HTMLElement>;
    private endDateElement: JQuery;
    private periodDate: PeriodDateType;
    private startDate: Date | null;
    private endDate: Date | null;

    constructor(openNewRoute: OpenNewRouteHandlerType) {
        this.openNewRoute = openNewRoute;

        this.createIncomeElement = document.getElementById('createIncome');
        this.createExpenseElement = document.getElementById('createExpense');
        this.intervalInputElement = document.getElementById('btnradio5');
        this.DT = $('#data-table');
        this.startDateElement = $('#startDate');
        this.endDateElement = $('#endDate');

        const than = this;
        document.querySelectorAll('.income-expenses_switch input.btn-check').forEach(item => {
            item.addEventListener('click', (e) => {
                if ((e.target as HTMLInputElement).checked) {
                    // console.log(e.target);
                    // console.log(item.nextElementSibling.innerText);
                    if (item.nextElementSibling) {
                        if (!(item.nextElementSibling as HTMLInputElement).innerText.includes('Интервал')) {
                            than.startDateElement.val('');
                            than.endDateElement.val('');
                            than.getIncomeExpensesList(than.funcFilter((item.nextElementSibling as HTMLInputElement).innerText)).then();
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
            language: "ru",

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
                        this.getIncomeExpensesList(this.funcFilter('Интервал')).then();
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
                        this.getIncomeExpensesList(this.funcFilter('Интервал')).then();
                    }
                } else {
                    this.endDateElement.val('');
                }
            }
        });


        this.getIncomeExpensesList().then();

        if (this.createIncomeElement) {
            this.createIncomeElement.addEventListener('click', (e) => {
                this.openNewRoute('/income-expenses/new?path=income');
            })
        }
        if (this.createExpenseElement) {
            this.createExpenseElement.addEventListener('click', (e) => {
                this.openNewRoute('/income-expenses/new?path=expense');
            })
        }
    }

    private funcFilter(action : string): PeriodDateType {

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

    private async getIncomeExpensesList(filter: PeriodDateType = this.periodDate): Promise<void | null> {
        const response: OperationsServiceReturnObjType = await OperationsService.getOperations(filter);

        if (response.error) {
            // alert(response.error);
            console.log(response.error);
            return response.redirect ? this.openNewRoute(response.redirect) : null;
        }
        if (!response.operations) {
            console.error('No operations data received');
            return;
        }
        this.showRecords(response.operations);
    }

    showRecords(operations: OperationsCategory): void {
        if ($.fn.DataTable.isDataTable('#data-table')) {
            this.DT.DataTable().clear().destroy();
        }

        const recordsElement: HTMLElement | null = document.getElementById('records');
        if (operations && Array.isArray(operations) && operations.length > 0) {
            // const operationsUp:OperationsCategory[] = operations.flat();
            for (let i = 0; i < operations.length; i++) {
                const trElement: HTMLTableRowElement = document.createElement('tr');
                trElement.insertCell().innerText = operations[i].id.toString();
                if (operations[i].type === 'income') {
                    let cellEl: HTMLTableCellElement = trElement.insertCell()
                    cellEl.style.color = 'green'
                    cellEl.textContent = operations[i].type === 'income' ? 'доход' : 'ошибка';
                } else {
                    let cellEl: HTMLTableCellElement = trElement.insertCell()
                    cellEl.style.color = 'red'
                    cellEl.textContent = operations[i].type === 'expense' ? 'расход' : 'ошибка';
                }
                trElement.insertCell().innerText = operations[i].category ? operations[i].category : 'ошибка';
                trElement.insertCell().innerText = operations[i].amount + '$';
                trElement.insertCell().innerText = operations[i].date;
                trElement.insertCell().innerText = operations[i].comment;

                trElement.insertCell().innerHTML = CommonUtils.generateGridToolsColumn('income-expenses', operations[i].id)

                if (recordsElement) {
                    recordsElement.appendChild(trElement);
                }
            }
        }


        this.DT.DataTable({
            dom: 'rtp',
            autoWidth: false,
            paging: true,       // Включить пагинацию
            searching: true,    // Включить поиск
            ordering: true,     // Включить сортировку
            info: true,         // Показывать информацию о записях
            pageLength: 10,      // Количество строк на странице
            columnDefs: [
                {
                    targets: [0, 1, 2, 3, 4], // индексы столбцов (начиная с 0)
                    className: 'dt-center' // встроенный класс DataTables для центрирования
                }
            ],
            language: {
                "paginate": {
                    "next": "Вперед",
                    "previous": "Назад"
                },
            }
        });

        // new DataTable('#data-table', {
        //     // Включение/отключение компонентов
        //     dom: 'rt', // Расположение элементов
        //     // Дополнительные стилевые настройки
        //     // style: 'width: 100%',
        //     // Автоматическая ширина столбцов
        //     autoWidth: false,
        //     // Растягивание таблицы по ширине контейнера
        //     // responsive: true,
        //     columnDefs: [
        //         {
        //             targets: [0, 1, 2, 3, 4], // индексы столбцов (начиная с 0)
        //             className: 'dt-center' // встроенный класс DataTables для центрирования
        //         }
        //     ],
        //     language: {
        //         "paginate": {
        //             "next": "Вперед",
        //             "previous": "Назад"
        //         },
        //     }
        // });


        // Применяем обработчик к ссылке
        const than = this; // сохраним контекст
        document.querySelectorAll('a.trash').forEach(link => {
            link.addEventListener('click', async function (this: HTMLAnchorElement, e: Event): Promise<void> {
                e.preventDefault();
                try {
                    const confirmed = await CommonUtils.showConfirmationDialog('Вы действительно хотите удалить операцию?');
                    if (confirmed) {
                        console.log("Переход удался")
                        console.log(`this..href ${this.href}`)
                        than.openNewRoute(this.href);
                    }
                } catch (error) {
                    console.log('Пользователь отменил переход');
                }
            });
        });

    }

}