import Tree from './tree';
import '../styles.css';
import {loadLeavesConfiguration} from './services';

class App {
    async start() {
        const leafNodes = await loadLeavesConfiguration();
        const tree = new Tree(960, 960, leafNodes, document.getElementsByTagName('body')[0]);
        tree.draw();
    }
}

window.addEventListener('load', function () {
    const app = new App();
    app.start();
});



