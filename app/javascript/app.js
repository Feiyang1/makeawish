import ModalController from './modal';

import services from './services';

class App {
    constructor() {
    }

    start() {
        this.draw();
    }

    draw() {
        var width = 960,
            height = 960,
            padding = 1.5, // separation between same-color nodes
            clusterPadding = 6, // separation between different-color nodes
            maxRadius = 12,
            centered;

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
                .on("click", async (d, idx) => {
                    d3.event.stopPropagation();
                    const message = await services.getMessage(idx);

                    const body = document.getElementsByTagName('body')[0];
                    const overlay = document.createElement('div');
                    overlay.className = 'overlay';
                    if (message) {
                        const content = showMessage(message);
                        overlay.appendChild(content);
                    }
                    else {
                        const content = purchaseMessage(idx);
                        overlay.appendChild(content);
                    }

                    body.appendChild(overlay);
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
                        services.purchaseMessage(idx, input.value);
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
    }
}

window.addEventListener('load', function () {
    const app = new App();
    app.start();
});



