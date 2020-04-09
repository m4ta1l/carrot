import {Connection} from "../Connection";
import {Node} from "../Node";
import {ConnectionType} from "../../enums/ConnectionType";
import {GatingType} from "../../enums/GatingType";

export abstract class Layer {
    public outputSize: number;
    public inputNodes: Set<Node>;
    public outputNodes: Set<Node>;
    public nodes: Node[];
    public connections: Connection[];
    public gates: Connection[];


    protected constructor(outputSize: number) {
        this.outputSize = outputSize;
        this.nodes = [];
        this.inputNodes = new Set<Node>();
        this.outputNodes = new Set<Node>();
        this.connections = [];
        this.gates = [];
    }

    public static connect(from: Layer | Set<Node> | Node[], to: Layer | Set<Node> | Node[], connectionType: ConnectionType = ConnectionType.ALL_TO_ALL, weight: number = 1): Connection[] {
        if (connectionType === ConnectionType.NO_CONNECTION) {
            throw new ReferenceError("Cannot connect with 'NO_CONNECTION' connection type");
        }

        const fromNodes: Node[] = Array.from(from instanceof Layer ? from.outputNodes : from);
        const toNodes: Node[] = Array.from(to instanceof Layer ? to.inputNodes : to);

        if (toNodes.length === 0) {
            throw new ReferenceError("Target from has no input nodes!");
        }
        if (fromNodes.length === 0) {
            throw new ReferenceError("This from has no output nodes!");
        }

        const connections: Connection[] = [];
        if (connectionType === ConnectionType.ALL_TO_ALL) {
            fromNodes.forEach(fromNode => {
                toNodes.forEach(toNode => {
                    connections.push(fromNode.connect(toNode, weight)); // connect every "from node" to every "to node"
                });
            });
        } else if (connectionType === ConnectionType.ONE_TO_ONE) {
            if (fromNodes.length !== toNodes.length) {
                throw new RangeError("Can't connect one to one! Number of output nodes from are unequal number of incoming nodes from next layer!");
            }
            for (let i: number = 0; i < fromNodes.length; i++) {
                connections.push(fromNodes[i].connect(toNodes[i], weight)); // connect every nodes with same indices
            }
        } else if (connectionType === ConnectionType.POOLING) {
            // connect the same amount of input nodes to every output node
            // every input node has only one connection available
            const ratio: number = toNodes.length / fromNodes.length;
            connections.push(...fromNodes.map((node, index) => node.connect(toNodes[Math.floor(index * ratio)], weight)));
        }
        return connections;
    }

    public static gate(nodes: Node[], connections: Connection[], gateType: GatingType): Connection[] {
        const gatedConnections: Connection[] = [];
        switch (gateType) {
            case GatingType.INPUT: { // gate incoming connections
                const toNodes: Node[] = Array.from(new Set(connections.map(conn => conn.to)));

                for (let i: number = 0; i < toNodes.length; i++) {
                    const node: Node = toNodes[i];
                    const gateNode: Node = nodes[i % nodes.length];

                    node.incoming
                        .filter(conn => connections.includes(conn))
                        .forEach(conn => {
                            gateNode.addGate(conn);
                            gatedConnections.push(conn);
                        });
                }
                break;
            }
            case GatingType.SELF: { // gate self connections
                const fromNodes: Node[] = Array.from(new Set(connections.map(conn => conn.from)));

                for (let i: number = 0; i < fromNodes.length; i++) {
                    if (connections.includes(fromNodes[i].selfConnection)) {
                        nodes[i % nodes.length].addGate(fromNodes[i].selfConnection);
                        gatedConnections.push(fromNodes[i].selfConnection);
                    }
                }
                break;
            }
            case GatingType.OUTPUT: { // gate outgoing connections
                const fromNodes: Node[] = Array.from(new Set(connections.map(conn => conn.from)));
                for (let i: number = 0; i < fromNodes.length; i++) {
                    const node: Node = fromNodes[i];
                    const gateNode: Node = nodes[i % nodes.length];

                    node.outgoing
                        .filter(conn => connections.includes(conn))
                        .forEach(conn => {
                            gateNode.addGate(conn);
                            gatedConnections.push(conn);
                        });
                }
                break;
            }
        }

        return gatedConnections;
    }

    public getDefaultIncomingConnectionType(): ConnectionType {
        return ConnectionType.ALL_TO_ALL;
    }

    public connectionTypeisAllowed(type: ConnectionType): boolean {
        return true;
    }
}
