import {Main} from "./components/main";
import {FileUtils} from "./utils/file-utils";
import {IncomeList} from "./components/income/income-list";
import {IncomeCreate} from "./components/income/income-create";
import {ExpensesList} from "./components/expenses/expenses-list";
import {ExpensesCreate} from "./components/expenses/expenses-create";
import {ExpensesEdit} from "./components/expenses/expenses-edit";
import {IncomeEdit} from "./components/income/income-edit";
import {IncomeExpensesList} from "./components/income-expenses/income-expenses-list";
import {IncomeExpensesNew} from "./components/income-expenses/income-expenses-new";
import {IncomeExpensesEdit} from "./components/income-expenses/income-expenses-edit";
import {Login} from "./components/auth/login";
import {SignUp} from "./components/auth/sign-up";
import {AuthUtils} from "./utils/auth-utils";
import {Logout} from "./components/auth/logout";
import {IncomeDelete} from "./components/income/income-delete";
import {ExpensesDelete} from "./components/expenses/expenses-delete";
import {IncomeExpensesDelete} from "./components/income-expenses/income-expenses-delete";
import {BalanceService} from "./services/balance-service";
import {RouteType} from "./types/route.type";
import {UserInfoNameType} from "./types/user-info-name.type";
import {UserInfoType} from "./types/user-info.type";

export class Router {
    private titlePageElement: HTMLElement | null;
    private contentPageElement: HTMLElement | null;
    private bootstrapStyleElement: HTMLElement | null;

    private routes: RouteType[];
    private balanceElement: HTMLElement | null = null;
    private profileNameElement: HTMLElement | null = null;
    private userName: string | null = null;

    constructor() {
        this.titlePageElement = document.getElementById('title');
        this.contentPageElement = document.getElementById('content');
        this.bootstrapStyleElement = document.getElementById('bootstrap_style');

        this.routes = [
            {
                route: '/',
                title: 'Главная',
                filePathTemplate: '/templates/pages/main.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new Main(this.openNewRoute.bind(this));
                },
                styles: ['bootstrap-datepicker.css'],
                scripts: ['chart.umd.js', 'bootstrap-datepicker.js', 'bootstrap-datepicker.ru.min.js']
            },
            {
                route: '/404',
                title: 'Страница не найдена',
                filePathTemplate: '/templates/pages/404.html',
                useLayout: false
            },
            {
                route: '/login',
                title: 'Авторизация',
                filePathTemplate: '/templates/pages/auth/login.html',
                useLayout: false,
                load: () => {
                    document.body.classList.add('login-page');
                    document.body.style.height = '100vh';
                    new Login(this.openNewRoute.bind(this));
                },
                unload: () => {
                    document.body.classList.remove('login-page');
                    document.body.style.height = 'auto';
                },
                styles: ['icheck-bootstrap.min.css']
            },
            {
                route: '/logout',
                load: () => {
                    new Logout(this.openNewRoute.bind(this));
                }

            },
            {
                route: '/sign-up',
                title: 'Регистрация',
                filePathTemplate: '/templates/pages/auth/sign-up.html',
                useLayout: false,
                load: () => {
                    document.body.classList.add('signup-page');
                    document.body.style.height = '100vh';
                    new SignUp(this.openNewRoute.bind(this));
                },
                unload: () => {
                    document.body.classList.remove('signup-page');
                    document.body.style.height = 'auto';
                }
            },
            {
                route: '/income',
                title: 'Доходы',
                filePathTemplate: '/templates/pages/income/list.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new IncomeList(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/income/create',
                title: 'Создание категории доходов',
                filePathTemplate: '/templates/pages/income/create.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new IncomeCreate(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/income/edit',
                title: 'Редактирование категории доходов',
                filePathTemplate: '/templates/pages/income/edit.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new IncomeEdit(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/income/delete',
                load: () => {
                    new IncomeDelete(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/expenses',
                title: 'Расходы',
                filePathTemplate: '/templates/pages/expenses/list.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new ExpensesList(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/expenses/create',
                title: 'Создание категории расходов',
                filePathTemplate: '/templates/pages/expenses/create.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new ExpensesCreate(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/expenses/edit',
                title: 'Редактирование категории расходов',
                filePathTemplate: '/templates/pages/expenses/edit.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new ExpensesEdit(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/expenses/delete',
                load: () => {
                    new ExpensesDelete(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/income-expenses',
                title: 'Доходы и расходы',
                filePathTemplate: '/templates/pages/income-expenses/list.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new IncomeExpensesList(this.openNewRoute.bind(this));
                },
                styles: ['bootstrap-datepicker.css'],
                scripts: ['bootstrap-datepicker.js', 'bootstrap-datepicker.ru.min.js', 'jquery.dataTables.min.js']
            },
            {
                route: '/income-expenses/new',
                title: 'Создание дохода/расхода',
                filePathTemplate: '/templates/pages/income-expenses/new.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new IncomeExpensesNew(this.openNewRoute.bind(this));
                },
                styles: ['bootstrap-datepicker.css'],
                scripts: ['bootstrap-datepicker.js', 'bootstrap-datepicker.ru.min.js']
            },
            {
                route: '/income-expenses/edit',
                title: 'Редактирование дохода/расхода',
                filePathTemplate: '/templates/pages/income-expenses/edit.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new IncomeExpensesEdit(this.openNewRoute.bind(this));
                },
                styles: ['bootstrap-datepicker.css'],
                scripts: ['bootstrap-datepicker.js', 'bootstrap-datepicker.ru.min.js']
            },
            {
                route: '/income-expenses/delete',
                load: () => {
                    new IncomeExpensesDelete(this.openNewRoute.bind(this));
                }
            },

        ];

        this.initEvents();
    }

    initEvents() {
        window.addEventListener('DOMContentLoaded', this.activateRoute.bind(this));
        window.addEventListener('popstate', this.activateRoute.bind(this));
        document.addEventListener('click', this.clickHandler.bind(this));
    }

    private async openNewRoute(url: string): Promise<void> {
        const currentRoute: string | null = window.location.pathname;
        history.pushState({}, '', url);
        await this.activateRoute(null, currentRoute);

    }

    private async clickHandler(e: MouseEvent): Promise<void> {
        let element: HTMLAnchorElement | null = null;
        const target = e.target as HTMLElement;
        if (target) {
            if (target.nodeName === 'A') {
                element = e.target as HTMLAnchorElement;
            } else if (target.parentNode && (target.parentNode as HTMLElement).nodeName === 'A') {
                element = target.parentNode as HTMLAnchorElement;
            }
        }
        if (element) {
            e.preventDefault();

            const currentRoute: string | null = window.location.pathname;
            const url: string | null = element.href.replace(window.location.origin, '');
            if (!url || (currentRoute === url.replace('#', '')) || url.startsWith('javascript:void(0)') || url.includes('income-expenses/delete')) {
                return;
            }

            await this.openNewRoute(url);
        }
    }

    async activateRoute(e: Event | null, oldRoute: string | null = null): Promise<void> {
        if (oldRoute) {
            const currentRoute: RouteType | undefined = this.routes.find(item => item.route === oldRoute);
            if (currentRoute) {
                if (currentRoute.styles && currentRoute.styles.length > 0) {
                    currentRoute.styles.forEach(style => {
                        const link: Element | null = document.querySelector(`link[href='/css/${style}']`);
                        if (link) link.remove();
                    })
                }
                if (currentRoute.scripts && currentRoute.scripts.length > 0) {
                    currentRoute.scripts.forEach(script => {
                        const link: Element | null = document.querySelector(`script[src='/js/${script}']`);
                        if (link) link.remove();
                    })
                }
                // console.log(currentRoute);
                if (currentRoute.unload && typeof currentRoute.unload === 'function') {
                    currentRoute.unload();
                }
            }
        }


        const urlRoute: string | null = window.location.pathname;
        const newRoute: RouteType | undefined = this.routes.find(item => item.route === urlRoute);
        if (newRoute) {
            if (newRoute.styles && newRoute.styles.length > 0) {
                newRoute.styles.forEach(style => {
                    FileUtils.loadPageStyle('/css/' + style, this.bootstrapStyleElement);
                });
            }
            if (newRoute.scripts && newRoute.scripts.length > 0) {
                for (const script of newRoute.scripts) {
                    await FileUtils.loadPageScript('/js/' + script);
                }

            }

            if (newRoute.title && this.titlePageElement) {
                this.titlePageElement.innerText = newRoute.title + ' | LumincoinFinance';
                console.log(newRoute.title);
            }

            if (newRoute.filePathTemplate) {
                // document.body.className = '';
                let contentBlock: HTMLElement | null = this.contentPageElement;
                if (newRoute.useLayout && this.contentPageElement) {
                    this.contentPageElement.innerHTML =
                        await fetch((newRoute.useLayout as string)).then(response => response.text());
                    // const response:Response = await fetch((newRoute.useLayout as string));
                    // this.contentPageElement.innerHTML = await response.text();

                    contentBlock = document.getElementById('content-layout');
                    // document.body.classList.add('sidebar-mini');
                    // document.body.classList.add('layout-fixed');

                    this.balanceElement = document.getElementById('balance');
                    const userBalance = await BalanceService.getBalance();
                    if (this.balanceElement) {
                        this.balanceElement.innerText = userBalance.balance + '$';
                    }

                    this.profileNameElement = document.getElementById('profile-name');
                    if (!this.userName) {
                        const userInfo: UserInfoType | UserInfoNameType = AuthUtils.getAuthInfo(AuthUtils.userinfoTokenKey) ? JSON.parse(AuthUtils.getAuthInfo(AuthUtils.userinfoTokenKey)) : '';
                        if (userInfo && (userInfo as UserInfoNameType).name) {
                            this.userName = (userInfo as UserInfoNameType).name;
                        }
                    }
                    if (this.profileNameElement && this.userName) {
                        this.profileNameElement.innerText = this.userName;
                    }
                    this.dropdown();

                    this.activateMenuItem(newRoute);
                } else {
                    document.body.classList.remove('sidebar-mini');
                    document.body.classList.remove('layout-fixed');
                }
                if (contentBlock) {
                    contentBlock.innerHTML =
                        await fetch(newRoute.filePathTemplate).then(response => response.text());
                }

            }

            if (newRoute.load && typeof newRoute.load === 'function') {
                newRoute.load();
            }

        } else {
            console.log('No route found!');
            history.pushState(null, '', '/404');
            await this.activateRoute(null);
        }
    }

    private activateMenuItem(route: RouteType): void {
        const menuCategoryElement: HTMLElement | null = document.getElementById('menu_category');

        document.querySelectorAll('.sidebar .nav-link').forEach(item => {
            const href: string | null = item.getAttribute('href');
             if (href) {
                 if ((route.route.includes(href) && href !== '/') || (route.route === '/' && href === '/')) {
                     if ((route.route.includes(href) && href !== '/income') || (route.route === '/income' && href === '/income')) {
                         item.classList.add('active');
                         if (['/income', '/expenses'].includes(href) && menuCategoryElement) {
                             menuCategoryElement.classList.remove('collapsed')
                             menuCategoryElement.setAttribute('aria-expanded', 'true');
                             let showMenu: Element | null = menuCategoryElement.nextElementSibling;
                             if (showMenu) {
                                 showMenu.classList.add('show');
                             }
                         }
                     }
                 } else {
                     item.classList.remove('active');
                 }
             }
        })
    }

    private dropdown(): void {
        let hideTimeout: number | undefined;
        const dropdownElement: HTMLElement | null = document.getElementById('dropdown');
        if (!dropdownElement) return;

        const menu: Element | null = dropdownElement.querySelector('.dropdown-menu');
        dropdownElement.addEventListener('mouseenter', () => {
            clearTimeout(hideTimeout);
            if (menu) {
                menu.classList.add('show');
            }
        });

        dropdownElement.addEventListener('mouseleave', () => {
            hideTimeout = window.setTimeout(() => {
                if (menu) {
                    menu.classList.remove('show');
                }
            }, 1000)
        });


    }

}