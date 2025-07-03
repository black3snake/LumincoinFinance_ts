export class CommonUtils {

    public static generateGridToolsColumn(entity:string, id: number): string {
        return '<div class="' + entity.slice(0, -1) + '-tools"> ' +
            '<a href="/' + entity + '/delete?id=' + id + '" class="trash"><img src="/images/trash.svg" alt="trash"></a>' +
            '<a href="/' + entity + '/edit?id=' + id + '" class="edit"><img src="/images/pen.svg" alt="pen"></a>' +
            '</div>';
    }

    public static showConfirmationDialog(message: string): Promise<boolean> {
        return new Promise((resolve) => {
            const modal = document.createElement('div');
            modal.classList.add('popup-container2');
            modal.setAttribute('id', 'popupContainer2');
            modal.innerHTML = `<div class="popup">
                <span>${message}</span>
                <div class="popup_action d-flex justify-content-center gap-2">
                    <button class="btn btn-success" id="popupDelete">Да, удалить</button>
                    <button class="btn btn-danger" id="popupNotDelete">Не удалять</button>
                </div>
            </div>`;
            document.body.appendChild(modal);

            const popupDelete: HTMLElement | null = document.getElementById('popupDelete');
            if (popupDelete) {
                popupDelete.addEventListener('click', () => {
                    document.body.removeChild(modal);
                    resolve(true);
                });
            }

            const popupNotDelete: HTMLElement | null = document.getElementById('popupNotDelete');
            if (popupNotDelete) {
                popupNotDelete.addEventListener('click', () => {
                    document.body.removeChild(modal);
                    resolve(false);
                });
            }
        });
    }


}