import { useContext, useEffect } from "react";
import { actionsContext, gettersContext, mutationsContext } from "./storeContext";
export var useAction = function (actionName) {
    var actions = useContext(actionsContext);
    if (!actions[actionName]) {
        throw new Error("Cannot find action: " + actionName);
    }
    return actions[actionName];
};
export var useMutation = function (mutationName) {
    var mutations = useContext(mutationsContext);
    if (!mutations[mutationName]) {
        throw new Error("Cannot find mutation: " + mutationName);
    }
    return mutations[mutationName];
};
export var useGetter = function (getterName) {
    var getters = useContext(gettersContext);
    if (!getters[getterName]) {
        throw new Error("Cannot find getter: " + getterName);
    }
    var value = useContext(getters[getterName]);
    return value;
};
export var useActionOnMount = function (actionName) {
    var action = useAction(actionName);
    useEffect(function () {
        action();
    }, [action]);
};
