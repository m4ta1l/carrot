"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivationNode = void 0;
const Utils_1 = require("../../utils/Utils");
const ConstantNode_1 = require("./ConstantNode");
/**
 * Activation node
 */
class ActivationNode extends ConstantNode_1.ConstantNode {
    constructor() {
        super();
    }
    /**
     * Actives the node.
     *
     * When a neuron activates, it computes its state from all its input connections and 'squashes' it using its activation function, and returns the output (activation).
     *
     * You can also provide the activation (a float between 0 and 1) as a parameter, which is useful for neurons in the input layer.
     *
     * @returns A neuron's output value
     */
    activate() {
        this.old = this.state;
        const incomingStates = Array.from(this.incoming).map(conn => conn.from.activation * conn.weight * conn.gain);
        if (incomingStates.length !== 1) {
            throw new ReferenceError("Only 1 incoming connections is allowed!");
        }
        this.state = incomingStates[0];
        this.activation = this.squash(this.state, false) * this.mask;
        this.derivativeState = this.squash(this.state, true);
        return this.activation;
    }
    /**
     * Backpropagate the error (a.k.a. learn).
     *
     * After an activation, you can teach the node what should have been the correct output (a.k.a. train). This is done by backpropagating. [Momentum](https://www.willamette.edu/~gorr/classes/cs449/momrate.html) adds a fraction of the previous weight update to the current one. When the gradient keeps pointing in the same direction, this will increase the size of the steps taken towards the minimum.
     *
     * If you combine a high learning rate with a lot of momentum, you will rush past the minimum (of the error function) with huge steps. It is therefore often necessary to reduce the global learning rate µ when using a lot of momentum (m close to 1).
     *
     * @param target The target value (i.e. "the value the network SHOULD have given")
     * @param options More options for propagation
     */
    propagate(target, options) {
        var _a, _b, _c;
        options.momentum = (_a = options.momentum) !== null && _a !== void 0 ? _a : 0;
        options.rate = (_b = options.rate) !== null && _b !== void 0 ? _b : 0.3;
        options.update = (_c = options.update) !== null && _c !== void 0 ? _c : true;
        const connectionsStates = Array.from(this.outgoing).map(conn => conn.to.errorResponsibility * conn.weight * conn.gain);
        this.errorResponsibility = this.errorProjected = Utils_1.sum(connectionsStates) * this.derivativeState;
        this.incoming.forEach(connection => {
            var _a, _b;
            // calculate gradient
            let gradient = this.errorProjected * connection.eligibility;
            connection.xTrace.forEach((value, key) => {
                gradient += key.errorResponsibility * value;
            });
            connection.deltaWeightsTotal += ((_a = options.rate) !== null && _a !== void 0 ? _a : 0.3) * gradient * this.mask;
            if (options.update) {
                connection.deltaWeightsTotal += ((_b = options.momentum) !== null && _b !== void 0 ? _b : 0) * connection.deltaWeightsPrevious;
                connection.weight += connection.deltaWeightsTotal;
                connection.deltaWeightsPrevious = connection.deltaWeightsTotal;
                connection.deltaWeightsTotal = 0;
            }
        });
    }
}
exports.ActivationNode = ActivationNode;
