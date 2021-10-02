"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GettersProvider = exports.gettersContext = exports.ActionsProvider = exports.actionsContext = exports.MutationsProvider = exports.mutationsContext = void 0;
var react_1 = require("react");
exports.mutationsContext = react_1.createContext({});
exports.MutationsProvider = react_1.memo(exports.mutationsContext.Provider);
exports.actionsContext = react_1.createContext({});
exports.ActionsProvider = react_1.memo(exports.actionsContext.Provider);
// this context holds the other contexts for each getter
exports.gettersContext = react_1.createContext({});
exports.GettersProvider = react_1.memo(exports.gettersContext.Provider);
