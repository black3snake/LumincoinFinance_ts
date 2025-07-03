import {IncomeCategory} from "../types/income-service-return-obj.type";

export class CreateEl {

    static cardElement: HTMLElement | null = null;
    static cardBodyElement: HTMLElement | null = null;

    public static createElementsList(actions: IncomeCategory, href: string): HTMLElement {
        this.cardElement = document.createElement("div");
        this.cardElement.classList.add('card');

        this.cardBodyElement = document.createElement("div");
        this.cardBodyElement.classList.add('card_body', 'd-flex', 'flex-column');

        const cardTitleElement: HTMLElement | null = document.createElement("div");
        cardTitleElement.classList.add('card_title');
        cardTitleElement.innerText = actions.title;

        const cardActionElement: HTMLElement | null = document.createElement("div");
        cardActionElement.classList.add('card_action', 'd-flex');

        const buttonEditElement: HTMLElement | null = document.createElement("a");
        buttonEditElement.classList.add('btn', 'btn-primary');
        buttonEditElement.innerText = "Редактировать";
        buttonEditElement.setAttribute('href', href + '/edit?id=' + actions.id);  // TODO будет формироваться через id

        const buttonDeleteElement: HTMLElement | null = document.createElement("a");
        buttonDeleteElement.classList.add('btn', 'btn-danger');
        buttonDeleteElement.innerText = 'Удалить';
        buttonDeleteElement.setAttribute('href', href + '/delete?id='+ actions.id);

        cardActionElement.appendChild(buttonEditElement);
        cardActionElement.appendChild(buttonDeleteElement);

        this.cardBodyElement.appendChild(cardTitleElement);
        this.cardBodyElement.appendChild(cardActionElement);
        this.cardElement.appendChild(this.cardBodyElement);

        return this.cardElement;
    }

    public static createElementNew(href: string): HTMLElement {
        this.cardElement = document.createElement("div");
        this.cardElement.classList.add('card', 'card_plus');
        this.cardBodyElement = document.createElement("div");
        this.cardBodyElement.classList.add('card_body', 'd-flex', 'card_plus');

        let bodyPlusElement: HTMLElement | null = document.createElement("a");
        bodyPlusElement.setAttribute('href', href);
        bodyPlusElement.classList.add('card_plus-text');
        bodyPlusElement.innerText = '+';
        this.cardBodyElement.appendChild(bodyPlusElement);
        this.cardElement.appendChild(this.cardBodyElement);
        return this.cardElement;
    }

    // static operationCreateOption(path) {
    //
    //
    // }


}