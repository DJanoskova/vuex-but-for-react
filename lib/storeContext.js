"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useGetter = exports.useMutation = exports.useAction = exports.GettersProvider = exports.gettersContext = exports.ActionsProvider = exports.actionsContext = exports.MutationsProvider = exports.mutationsContext = void 0;
var react_1 = require("react");
exports.mutationsContext = react_1.createContext({});
exports.MutationsProvider = react_1.memo(exports.mutationsContext.Provider);
exports.actionsContext = react_1.createContext({});
exports.ActionsProvider = react_1.memo(exports.actionsContext.Provider);
exports.gettersContext = react_1.createContext({});
exports.GettersProvider = react_1.memo(exports.gettersContext.Provider);
var useAction = function (actionName) {
    var actions = react_1.useContext(exports.actionsContext);
    return actions[actionName];
};
exports.useAction = useAction;
var useMutation = function (mutationName) {
    var mutations = react_1.useContext(exports.mutationsContext);
    return mutations[mutationName];
};
exports.useMutation = useMutation;
var useGetter = function (getterName) {
    var getters = react_1.useContext(exports.gettersContext);
    var value = react_1.useContext(getters[getterName]);
    return value;
};
exports.useGetter = useGetter;
//# sourceMappingURL=storeContext.js.map