import ModalController from './modal';
import services, { loadTreeTrunk, loadLeavesConfiguration } from './services';

export default class Tree {
    constructor(width, height, container) {
        this.width = width;
        this.height = height;
        this.container = container;
    }

    async draw() {
        const svg = d3.select(this.container).append("svg")
            .attr("width", this.width)
            .attr("height", this.height)
            .style('border', '1px solid black');

        const trunk = svg
            .append('g')
            .style('fill', 'saddlebrown')
            .attr('transform', 'translate(100, 230)');

        // tree truck
        try {
            const svgXml = await loadTreeTrunk();
            trunk.node()
                .appendChild(svgXml.documentElement);

            trunk.select('svg')
                .attr('width', 800)
                .attr('height', 800);
        } catch (e) {
            throw e;
        }

        try {
            const data = await loadLeavesConfiguration();
            data.forEach(function (d) {
                d.size = +d.size;
            });

            var n = data.length; // total number of nodes

            //create clusters and nodes
            var nodes = [];
            for (var i = 0; i < n; i++) {
                nodes.push(this.create_nodes(data, i));
            }

            var simulation = d3.forceSimulation()
                .force("link", d3.forceLink().id(function (d) { return d.index }))
                .force("collide", d3.forceCollide(function (d) { return d.radius + 3 }).iterations(16))
                .force("charge", d3.forceManyBody())
                .force("center", d3.forceCenter(this.width / 2, this.height / 2))
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
                        const content = this.showMessage(message);
                        overlay.appendChild(content);
                    }
                    else {
                        const content = this.purchaseMessage(idx);
                        overlay.appendChild(content);
                    }

                    body.appendChild(overlay);
                })
                .call(d3.drag()
                    .on("start", dragstarted)
                    .on("drag", dragged)
                    .on("end", dragended));

            simulation.nodes(nodes)
                .on("tick", tick);
        } catch (e) {
            throw e;
        }

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
    }

    create_nodes(data, node_counter) {
        return {
            radius: data[node_counter].size * 1.5,
            text: data[node_counter].text
        };
    }

    showMessage(msg) {
        const message = document.createElement('div');
        message.className = 'content';
        message.textContent = msg;
        return message;
    }

    purchaseMessage(idx) {
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
}