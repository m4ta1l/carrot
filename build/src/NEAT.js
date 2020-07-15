"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NEAT = void 0;
var TimSort = __importStar(require("timsort"));
var Species_1 = require("./architecture/Species");
var Mutation_1 = require("./methods/Mutation");
var Utils_1 = require("./utils/Utils");
/**
 * Runs the NEAT algorithm on group of neural networks.
 *
 * @constructs Neat
 */
var NEAT = /** @class */ (function () {
    /**
     * Constructs a NEAT object.
     *
     * @param options
     */
    function NEAT(options) {
        if (!options.fitnessFunction) {
            throw new ReferenceError("No fitness function given!");
        }
        this._options = options;
        this.population = [];
        this.species = new Set();
        for (var i = 0; i < this.options.populationSize; i++) {
            this.population.push(this.options.template.copy());
        }
    }
    Object.defineProperty(NEAT.prototype, "options", {
        /**
         * Getter
         */
        get: function () {
            return this._options;
        },
        /**
         * Setter
         */
        set: function (value) {
            this._options = value;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Mutate a network with a random mutation from the allowed array.
     *
     * @param network The network which will be mutated.
     */
    NEAT.prototype.mutateRandom = function (network) {
        var _this = this;
        var allowed = this.options.mutations.filter(function (method) {
            return (method.constructor.name !== Mutation_1.AddNodeMutation.constructor.name || network.nodes.length < _this.options.maxNodes ||
                method.constructor.name !== Mutation_1.AddConnectionMutation.constructor.name || network.connections.size < _this.options.maxConnections ||
                method.constructor.name !== Mutation_1.AddGateMutation.constructor.name || network.gates.size < _this.options.maxGates);
        });
        network.mutate(Utils_1.pickRandom(allowed), { allowedActivations: this.options.activations });
    };
    /**
     * Evaluates, selects, breeds and mutates population
     *
     * @returns {Network} Fittest network
     */
    NEAT.prototype.evolve = function () {
        return __awaiter(this, void 0, void 0, function () {
            var elitists, fittest;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this.genSpecies();
                        if (!(this.population[this.population.length - 1].score === undefined)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.evaluate()];
                    case 1:
                        _b.sent();
                        this.sort();
                        _b.label = 2;
                    case 2:
                        this.species.forEach(function (species) { return species.evaluateScore(); });
                        this.kill(1 - this.options.survivors);
                        this.removeExtinctSpecies();
                        this.reproduce();
                        elitists = this.population.splice(0, this.options.elitism);
                        this.mutate();
                        (_a = this.population).splice.apply(_a, __spreadArrays([0, 0], elitists));
                        /*if (this.options.training) {
                            for (const genome of this.population) {
                                genome.train(this.options.training);
                            }
                        }*/
                        // evaluate the population
                        return [4 /*yield*/, this.evaluate()];
                    case 3:
                        /*if (this.options.training) {
                            for (const genome of this.population) {
                                genome.train(this.options.training);
                            }
                        }*/
                        // evaluate the population
                        _b.sent();
                        // Sort in order of fitness (fittest first)
                        this.sort();
                        fittest = this.population[0].copy();
                        fittest.score = this.population[0].score;
                        // Reset the scores
                        this.population.forEach(function (genome) { return genome.score = undefined; });
                        this.options.generation++;
                        return [2 /*return*/, fittest];
                }
            });
        });
    };
    /**
     * Mutates the given (or current) population
     *
     * @param {Mutation} [method] A mutation method to mutate the population with. When not specified will pick a random mutation from the set allowed mutations.
     */
    NEAT.prototype.mutate = function (method) {
        var _this = this;
        // Elitist genomes should not be included
        this.population
            .filter(function () { return Math.random() <= _this.options.mutationRate; })
            .forEach(function (genome) {
            for (var i = 0; i < _this.options.mutationAmount; i++) {
                if (method) {
                    genome.mutate(method);
                }
                else {
                    _this.mutateRandom(genome);
                }
            }
        });
    };
    /**
     * Evaluates the current population, basically sets their `.score` property
     *
     * @return {Network} Fittest Network
     */
    NEAT.prototype.evaluate = function () {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (this.options.clear) {
                            this.population.forEach(function (genome) { return genome.clear(); });
                        }
                        return [4 /*yield*/, ((_b = (_a = this.options).fitnessFunction) === null || _b === void 0 ? void 0 : _b.call(_a, this.population, this.options.dataset))];
                    case 1:
                        _c.sent();
                        // Sort the population in order of fitness
                        this.sort();
                        return [2 /*return*/, this.population[0]];
                }
            });
        });
    };
    /**
     * Sorts the population by score (descending)
     * @todo implement a quicksort algorithm in utils
     */
    NEAT.prototype.sort = function () {
        TimSort.sort(this.population, function (a, b) {
            return a.score === undefined || b.score === undefined ? 0 : b.score - a.score;
        });
    };
    /**
     * Returns the fittest genome of the current population
     *
     * @returns {Network} Current population's fittest genome
     */
    NEAT.prototype.getFittest = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.population[this.population.length - 1].score === undefined)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.evaluate()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        this.sort();
                        return [2 /*return*/, this.population[0]];
                }
            });
        });
    };
    /**
     * Returns the average fitness of the current population
     *
     * @returns {number} Average fitness of the current population
     */
    NEAT.prototype.getAverage = function () {
        return __awaiter(this, void 0, void 0, function () {
            var score;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.population[this.population.length - 1].score === undefined)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.evaluate()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        score = 0;
                        this.population
                            .map(function (genome) { return genome.score; })
                            .forEach(function (val) { return score += val !== null && val !== void 0 ? val : 0; });
                        return [2 /*return*/, score / this.population.length];
                }
            });
        });
    };
    /**
     * Replace the whole population with the new genomes
     * @param genomes the genomes which replace the population
     */
    NEAT.prototype.replacePopulation = function (genomes) {
        this.population = genomes;
        this.options.populationSize = genomes.length;
    };
    /**
     * Reproduce the population, by replacing the killed networks
     * @private
     */
    NEAT.prototype.reproduce = function () {
        var speciesArr = Array.from(this.species);
        for (var i = 0; i < this.population.length; i++) {
            if (this.population[i].species === null) {
                var selectedSpecies = this.options.selection.select(speciesArr);
                this.population[i] = selectedSpecies.breed();
                selectedSpecies.forcePut(this.population[i]);
            }
        }
    };
    /**
     * Remove empty species
     * @private
     */
    NEAT.prototype.removeExtinctSpecies = function () {
        for (var _i = 0, _a = Array.from(this.species); _i < _a.length; _i++) {
            var species = _a[_i];
            if (species.size() <= 1) {
                species.members.forEach(function (member) { return member.species = null; });
                this.species.delete(species);
            }
        }
    };
    /**
     * Kill bad networks
     * @param killRate
     * @private
     */
    NEAT.prototype.kill = function (killRate) {
        this.species.forEach(function (species) { return species.kill(killRate); });
    };
    /**
     * Generate species
     * @private
     */
    NEAT.prototype.genSpecies = function () {
        var _this = this;
        this.species.forEach(function (species) { return species.reset(); });
        this.population.filter(function (genome) { return genome.species === null; }).forEach(function (genome) {
            var found = false;
            for (var _i = 0, _a = Array.from(_this.species); _i < _a.length; _i++) {
                var species = _a[_i];
                if (species.put(genome, _this.options.c1, _this.options.c2, _this.options.c3, _this.options.speciesDistanceThreshold)) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                _this.species.add(new Species_1.Species(genome));
            }
        });
    };
    return NEAT;
}());
exports.NEAT = NEAT;
