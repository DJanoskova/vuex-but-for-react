var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
import { useContext, useEffect } from "react";
import { actionsContext, gettersContext, mutationsContext } from "./storeContext";
export var useAction = function (actionName) {
    var actions = useContext(actionsContext);
    if (!actions[actionName]) {
        throw new Error("Cannot find action: " + actionName);
    }
    return actions[actionName];
};
export var useActions = function (values) {
    var actions = useContext(actionsContext);
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
export var useMutation = function (mutationName) {
    var mutations = useContext(mutationsContext);
    if (!mutations[mutationName]) {
        throw new Error("Cannot find mutation: " + mutationName);
    }
    return mutations[mutationName];
};
export var useMutations = function (values) {
    var mutations = useContext(mutationsContext);
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
export var useGetter = function (getterName) {
    var getters = useContext(gettersContext);
    if (!getters[getterName]) {
        throw new Error("Cannot find getter: " + getterName);
    }
    var value = useContext(getters[getterName]);
    return value;
};
export var useGetters = function (values) {
    var getters = useContext(gettersContext);
    var result = [];
    values.forEach(function (getterName) {
        if (!getters[getterName]) {
            throw new Error("Cannot find getter: " + getterName);
        }
        else {
            var value = useContext(getters[getterName]);
            result.push(value);
        }
    });
    return result;
};
export var useActionOnMount = function (actionName) {
    var params = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        params[_i - 1] = arguments[_i];
    }
    var action = useAction(actionName);
    useEffect(function () {
        action.apply(void 0, params);
    }, __spreadArray([action], params));
};
