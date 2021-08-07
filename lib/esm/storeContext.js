import { createContext, useContext, memo } from 'react';
export var mutationsContext = createContext({});
export var MutationsProvider = memo(mutationsContext.Provider);
export var actionsContext = createContext({});
export var ActionsProvider = memo(actionsContext.Provider);
// this context holds the other contexts for each getter
export var gettersContext = createContext({});
export var GettersProvider = memo(gettersContext.Provider);
export var useAction = function (actionName) {
    var actions = useContext(actionsContext);
    return actions[actionName];
};
export var useMutation = function (mutationName) {
    var mutations = useContext(mutationsContext);
    return mutations[mutationName];
};
export var useGetter = function (getterName) {
    var getters = useContext(gettersContext);
    var value = useContext(getters[getterName]);
    return value;
};
