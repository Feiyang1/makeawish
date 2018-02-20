import Tree from './tree';
import '../styles.css';
import services from './services';
import { loadLeavesConfiguration } from './resources';

class App {
    async start() {
        // start app after account is properly loaded
        await services.initAccount();
        const leafNodes = loadLeavesConfiguration();
        const body = document.getElementsByTagName('body')[0]
        const tree = new Tree(960, 960, leafNodes, body);
        tree.draw();


        // show admin functions only to owner
        if (services.account === await services.getOwner()){
            let withDraw = document.createElement('div');
            withDraw.textContent = 'withDraw please';
            withDraw.addEventListener('click', function() {
                services.withdraw();
            });
            body.appendChild(withDraw)
        }
    }
}

window.addEventListener('load', function () {
    const app = new App();
    app.start();
});



