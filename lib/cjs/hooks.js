"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useActionOnMount = exports.useGetter = exports.useMutations = exports.useMutation = exports.useActions = exports.useAction = void 0;
var react_1 = require("react");
var storeContext_1 = require("./storeContext");
var useAction = function (actionName) {
    var actions = react_1.useContext(storeContext_1.actionsContext);
    if (!actions[actionName]) {
        throw new Error("Cannot find action: " + actionName);
    }
    return actions[actionName];
};
exports.useAction = useAction;
var useActions = function (values) {
    var actions = react_1.useContext(storeContext_1.actionsContext);
    var result = [];
    values.forEach(function (actionName) {
        if (!actions[actionName]) {
            throw new Error("Cannot find action: " + actionName);
        }
        else {
            result.push(actions[actionName]);
        }
    });
    return result;
};
exports.useActions = useActions;
var useMutation = function (mutationName) {
    var mutations = react_1.useContext(storeContext_1.mutationsContext);
    if (!mutations[mutationName]) {
        throw new Error("Cannot find mutation: " + mutationName);
    }
    return mutations[mutationName];
};
exports.useMutation = useMutation;
var useMutations = function (values) {
    var mutations = react_1.useContext(storeContext_1.mutationsContext);
    var result = [];
    values.forEach(function (mutationName) {
        if (!mutations[mutationName]) {
            throw new Error("Cannot find mutation: " + mutationName);
        }
        else {
            result.push(mutations[mutationName]);
        }
    });
    return result;
};
exports.useMutations = useMutations;
var useGetter = function (getterName) {
    var getters = react_1.useContext(storeContext_1.gettersContext);
    if (!getters[getterName]) {
        throw new Error("Cannot find getter: " + getterName);
    }
    var value = react_1.useContext(getters[getterName]);
    return value;
};
exports.useGetter = useGetter;
var useActionOnMount = function (actionName) {
    var params = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        params[_i - 1] = arguments[_i];
    }
    var action = exports.useAction(actionName);
    react_1.useEffect(function () {
        action.apply(void 0, params);
    }, __spreadArray([action], params));
};
exports.useActionOnMount = useActionOnMount;