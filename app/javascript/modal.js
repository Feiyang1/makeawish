import services from './services';

class ModalController {
    constructor() {
        this.initialize();
    }

    showMessage(message) {
        this.show(messageComponent(message));
    }

    showPurchase(idx) {
        this.show(purchaseMessageComponent(idx));
    }

    show(component) {
        const body = document.getElementsByTagName('body')[0];
        const overlay = document.createElement('div');
        overlay.className = 'overlay';
        overlay.appendChild(component);
        overlay.addEventListener('click', () => console.log('overlay clicked'));
        body.appendChild(overlay);
    }

    close() {
        // remove layover if it exists
        const layover = Array.from(document.getElementsByClassName('overlay'));
        if (layover.length > 0) {
            console.log('removing')
        }
        layover.forEach((l) => l.remove());
    }

    initialize() {
        const body = document.getElementsByTagName('body')[0];
        body.addEventListener('click', () => {
            this.close();
        });
    }
}

function messageComponent(msg) {
    const message = document.createElement('div');
    message.className = 'content';
    message.textContent = msg;
    return message;
}

function purchaseMessageComponent(idx) {
    const content = document.createElement('div');
    content.className = 'purchase';
    const input = document.createElement('input');
    input.type = 'text';
    const button = document.createElement('div');
    button.className = 'purchase-button';
    button.textContent = 'Purchase';
    content.appendChild(input);
    content.appendChild(button);

    content.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    button.addEventListener('click', async () => {
        if (input.value) {
            console.log(input.value);
            const tx = await services.purchaseMessage(idx, input.value);
            const txDiv = document.createElement('div');
            txDiv.textContent = 'transaction id: ' + tx.tx;
            content.appendChild(txDiv);
        } else {
            console.log('no value');
        }
    });

    return content;
}

export default new ModalController();