import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import * as d3 from 'd3';

interface Node {
    id: string;
    group: number;
    type: string;
}

interface Link {
    source: string;
    target: string;
    value: number;
    type: string;
}

const NetworkVisualization: React.FC = () => {
    const svgRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        if (!svgRef.current) return;

        const nodes: Node[] = [
            { id: "Your Computer", group: 1, type: "user" },
            { id: "Friend's Wallet", group: 1, type: "user" },
            { id: "Local Shop", group: 1, type: "business" },
            { id: "Validator 1", group: 2, type: "validator" },
            { id: "Validator 2", group: 2, type: "validator" },
            { id: "Validator 3", group: 2, type: "validator" }
        ];

        const links: Link[] = [
            { source: "Your Computer", target: "Validator 1", value: 1, type: "transaction" },
            { source: "Your Computer", target: "Friend's Wallet", value: 1, type: "payment" },
            { source: "Local Shop", target: "Validator 2", value: 1, type: "transaction" },
            { source: "Validator 1", target: "Validator 2", value: 2, type: "sync" },
            { source: "Validator 2", target: "Validator 3", value: 2, type: "sync" },
            { source: "Validator 3", target: "Validator 1", value: 2, type: "sync" }
        ];

        const width = 600;
        const height = 400;
        const svg = d3.select(svgRef.current)
            .attr("viewBox", `0 0 ${width} ${height}`);

        svg.selectAll("*").remove();

        const legend = svg.append("g")
            .attr("class", "legend")
            .attr("transform", "translate(20, 20)");

        const legendItems = [
            { label: "Your Devices", color: "var(--color-1)" },
            { label: "Network Validators", color: "var(--color-2)" },
            { label: "Active Connections", color: "var(--accent-color)" }
        ];

        legendItems.forEach((item, i) => {
            const legendRow = legend.append("g")
                .attr("transform", `translate(0, ${i * 20})`);
            
            legendRow.append("circle")
                .attr("r", 6)
                .attr("fill", item.color);

            legendRow.append("text")
                .attr("x", 15)
                .attr("y", 5)
                .text(item.label)
                .attr("class", "legend-text");
        });

        const simulation = d3.forceSimulation(nodes as any)
            .force("link", d3.forceLink(links).id((d: any) => d.id).distance(100))
            .force("charge", d3.forceManyBody().strength(-200))
            .force("center", d3.forceCenter(width / 2, height / 2))
            .force("collision", d3.forceCollide().radius(50));

        svg.append("defs").selectAll("marker")
            .data(["transaction", "payment", "sync"])
            .enter().append("marker")
            .attr("id", d => `arrow-${d}`)
            .attr("viewBox", "0 -5 10 10")
            .attr("refX", 20)
            .attr("refY", 0)
            .attr("markerWidth", 6)
            .attr("markerHeight", 6)
            .attr("orient", "auto")
            .append("path")
            .attr("d", "M0,-5L10,0L0,5")
            .attr("class", d => `arrow-${d}`);

        const link = svg.append("g")
            .selectAll("line")
            .data(links)
            .join("line")
            .attr("stroke", d => getStrokeColor(d.type))
            .attr("stroke-width", d => Math.sqrt(d.value) * 2)
            .attr("marker-end", d => `url(#arrow-${d.type})`)
            .attr("class", "network-link");

        const flowingDots = svg.append("g")
            .selectAll("circle")
            .data(links)
            .join("circle")
            .attr("r", 3)
            .attr("class", "flowing-dot")
            .attr("fill", d => getStrokeColor(d.type));

        const node = svg.append("g")
            .selectAll("g")
            .data(nodes)
            .join("g")
            .attr("class", "node-group")
            .call(drag(simulation) as any);

        node.append("circle")
            .attr("r", 20)
            .attr("fill", d => getNodeColor(d.type))
            .attr("class", "node-circle");

        node.append("text")
            .text(d => getNodeIcon(d.type))
            .attr("class", "node-icon")
            .attr("text-anchor", "middle")
            .attr("dy", "0.3em");

        node.append("title")
            .text(d => d.id);

        node.append("text")
            .text(d => d.id)
            .attr("class", "node-label")
            .attr("text-anchor", "middle")
            .attr("dy", "2em");

        simulation.on("tick", () => {
            link
                .attr("x1", (d: any) => d.source.x)
                .attr("y1", (d: any) => d.source.y)
                .attr("x2", (d: any) => d.target.x)
                .attr("y2", (d: any) => d.target.y);

            node
                .attr("transform", (d: any) => `translate(${d.x},${d.y})`);

            flowingDots
                .attr("cx", function(d: any) {
                    const progress = (Date.now() / 1000) % 1;
                    return d.source.x + (d.target.x - d.source.x) * progress;
                })
                .attr("cy", function(d: any) {
                    const progress = (Date.now() / 1000) % 1;
                    return d.source.y + (d.target.y - d.source.y) * progress;
                });
        });

        function animate() {
            flowingDots.each(function(this: any) {
                d3.select(this).attr("opacity", () => Math.random());
            });
            requestAnimationFrame(animate);
        }
        animate();
    }, []);

    return (
        <div className="network-visualization-container">
            <svg ref={svgRef} className="network-visualization" />
            <div className="visualization-overlay">
                <div className="visualization-tooltip">
                    Watch how information flows through the network
                </div>
            </div>
        </div>
    );
};

function drag(simulation: any) {
    function dragstarted(event: any) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
    }

    function dragged(event: any) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
    }

    function dragended(event: any) {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
    }

    return d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
}

function getNodeColor(type: string): string {
    switch (type) {
        case "user": return "var(--color-1)";
        case "business": return "var(--color-3)";
        case "validator": return "var(--color-2)";
        default: return "var(--color-4)";
    }
}

function getNodeIcon(type: string): string {
    switch (type) {
        case "user": return "👤";
        case "business": return "🏪";
        case "validator": return "🖥️";
        default: return "•";
    }
}

function getStrokeColor(type: string): string {
    switch (type) {
        case "transaction": return "var(--accent-color)";
        case "payment": return "var(--color-success)";
        case "sync": return "var(--color-secondary)";
        default: return "var(--color-4)";
    }
}

export default NetworkVisualization; 