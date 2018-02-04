import Tree from './tree';
import '../styles.css';
import services, { loadLeavesConfiguration } from './services';

class App {
    start() {
        const leafNodes = loadLeavesConfiguration();
        const body = document.getElementsByTagName('body')[0]
        const tree = new Tree(960, 960, leafNodes, body);
        tree.draw();

        let withDraw = document.createElement('div');
        withDraw.textContent = 'withDraw please';
        withDraw.addEventListener('click', function() {
            services.withdraw();
        });
        body.appendChild(withDraw)
    }
}

window.addEventListener('load', function () {
    const app = new App();
    app.start();
});



