"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useActionOnMount = exports.useGetter = exports.useMutation = exports.useAction = void 0;
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
var useMutation = function (mutationName) {
    var mutations = react_1.useContext(storeContext_1.mutationsContext);
    if (!mutations[mutationName]) {
        throw new Error("Cannot find mutation: " + mutationName);
    }
    return mutations[mutationName];
};
exports.useMutation = useMutation;
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
    var action = exports.useAction(actionName);
    react_1.useEffect(function () {
        action();
    }, [action]);
};
exports.useActionOnMount = useActionOnMount;
