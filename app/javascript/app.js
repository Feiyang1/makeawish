import contract from 'truffle-contract';
import getWeb3Instance from './web3';

import wishing_tree_artifacts from '../../build/contracts/WishingTree.json'

function App() {
    const web3 = getWeb3Instance();
    const wishingTree = initializeContract(wishing_tree_artifacts, web3.currentProvider);
    wishingTree.setProvider(web3.currentProvider);
    let account;

    // Get the initial account balance so it can be displayed.
    // getAccounts does not return promise, so we are hoping account becomes available before it is used.
    // probably should rewrite it so it's more reliable.
    web3.eth.getAccounts(function (err, accs) {
        if (err != null) {
            alert("There was an error fetching your accounts.");
            return;
        }

        if (accs.length == 0) {
            alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
            return;
        }

        account = accs[0];
    })


    var width = 960,
        height = 960,
        padding = 1.5, // separation between same-color nodes
        clusterPadding = 6, // separation between different-color nodes
        maxRadius = 12,
        centered;

    // var color = d3.scale.ordinal()
    //     .range(["#7A99AC", "#E4002B"]);

    var svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height)
        .style('border', '1px solid black');

    let trunk = svg
        .append('g')
        .style('fill', 'saddlebrown')
        .attr('transform', 'translate(100, 230)');

    // tree truck
    d3.xml("/resources/noun_441084_cc.svg").mimeType("image/svg+xml").get(function (error, xml) {
        if (error) throw error;
        trunk.node()
            .appendChild(xml.documentElement);

        trunk.select('svg')
            .attr('width', 800)
            .attr('height', 800);
    });


    d3.text("word_groups.csv", function (error, text) {
        if (error) throw error;
        var colNames = "text,size,group\n" + text;
        var data = d3.csvParse(colNames);

        data.forEach(function (d) {
            d.size = +d.size;
        });

        var n = data.length; // total number of nodes

        //create clusters and nodes
        var nodes = [];
        for (var i = 0; i < n; i++) {
            nodes.push(create_nodes(data, i));
        }

        var simulation = d3.forceSimulation()
            .force("link", d3.forceLink().id(function (d) { return d.index }))
            .force("collide", d3.forceCollide(function (d) { return d.radius + 3 }).iterations(16))
            .force("charge", d3.forceManyBody())
            .force("center", d3.forceCenter(width / 2, height / 2))
            .force("y", d3.forceY(0))
            .force("x", d3.forceX(0));

        var node = svg.append("g")
            .attr("class", "nodes")
            .selectAll("circle")
            .data(nodes)
            .enter().append("circle")
            .attr("r", function (d) { return d.radius })
            .on("click", function (d, idx) {
                const body = document.getElementsByTagName('body')[0];
                const overlay = document.createElement('div');
                overlay.className = 'overlay';


                wishingTree.deployed().then(async (instance) => {
                    console.log("deployed");
                    const meta = instance;
                    const message = await meta.readMessage.call(idx, { from: account });
                    if (message) {
                        const content = showMessage(message);
                        overlay.appendChild(content);
                    }
                    else {
                        const content = purchaseMessage(idx);
                        overlay.appendChild(content);
                    }

                }).catch((e) => {
                    console.log(e);
                });

                body.appendChild(overlay);
                d3.event.stopPropagation();
            })
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended));

        function showMessage(msg) {
            const message = document.createElement('div');
            message.className = 'content';
            message.textContent = msg;
            return message;
        }

        function purchaseMessage(idx) {
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
                    const smartContract = await wishingTree.deployed();
                    const tx = await smartContract.addMessage(idx, input.value, { from: account, value: web3.toWei(1, "ether") });
                    console.log(tx);
                } else {
                    console.log('no value');
                }
            });
            return content;
        }

        simulation.nodes(nodes)
            .on("tick", tick);

        function create_nodes(data, node_counter) {
            var r = Math.sqrt(-Math.log(Math.random())) * maxRadius,
                d = {
                    radius: data[node_counter].size * 1.5,
                    text: data[node_counter].text
                };

            return d;
        };



        function tick(e) {
            node
                .attr("cx", function (d) { return d.x; })
                .attr("cy", function (d) { return d.y; });
        }

        function dragstarted(d) {
            if (!d3.event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }

        function dragged(d) {
            d.fx = d3.event.x;
            d.fy = d3.event.y;
        }

        function dragended(d) {
            if (!d3.event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }
    });

    Array.prototype.contains = function (v) {
        for (var i = 0; i < this.length; i++) {
            if (this[i] === v) return true;
        }
        return false;
    };

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

window.addEventListener('load', function () {
    App();
});

function initializeContract(artifacts, provider) {
    const sc = contract(artifacts);
    sc.setProvider(provider);

    return sc;
}
