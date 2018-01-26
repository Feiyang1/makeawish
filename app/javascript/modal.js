class ModalController {
    constructor() {
        this.initialize();
    }

    show() {
        
    }

    initialize() {
        const body = document.getElementsByTagName('body')[0];
        body.addEventListener('click', () => {
            // remove layover if it exists
            const layover = Array.from(document.getElementsByClassName('overlay'));
            if (layover.length > 0) {
                console.log('removing')
            }
            layover.forEach((l) => l.remove());
        });
    }
}

export default new ModalController();