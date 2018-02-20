import ModalController from './modal';
import services from './services';
import { loadLeaf, loadTreeTrunk, loadLeavesConfiguration } from './resources';
import * as d3 from 'd3';

export default class Tree {
    constructor(width, height, nodes, container) {
        this.width = width;
        this.height = height;
        this.nodes = nodes;
        this.container = container;
    }

    draw() {
        const svg = d3.select(this.container).append("svg")
            .attr("width", this.width)
            .attr("height", this.height)
            .style('border', '1px solid black');

        const trunk = svg
            .append('g')
            .style('fill', 'saddlebrown')
            .attr('transform', 'translate(100, 230)');

        // tree truck
        const svgXml = loadTreeTrunk();
        trunk.node().innerHTML = svgXml;

        // leaf
        const leaf = loadLeaf();

        trunk.select('svg')
            .attr('width', 800)
            .attr('height', 800);

        try {
            const data = this.nodes;
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
                .selectAll("use")
                .data(nodes)
                .enter().append("use")
                .attr("href", "#leaf")
                .attr("width", (d) => d.radius*2)
                .attr("height", (d) => d.radius*2)
                .attr("r", function (d) { return d.radius })
                .on("click", async (d, idx) => {
                    d3.event.stopPropagation();
                    const message = await services.getMessage(idx);

                    if (message) {
                        ModalController.showMessage(message);
                    } else {
                        ModalController.showPurchase(idx);
                    }

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
                .attr("x", function (d) { return d.x - d.radius; })
                .attr("y", function (d) { return d.y - d.radius; });
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
}