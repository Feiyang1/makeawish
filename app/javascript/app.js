import Tree from './tree';

class App {
    constructor() {
    }

    start() {
        const tree = new Tree(960, 960, document.getElementsByTagName('body')[0]);
        tree.draw();
    }
}

window.addEventListener('load', function () {
    const app = new App();
    app.start();
});



