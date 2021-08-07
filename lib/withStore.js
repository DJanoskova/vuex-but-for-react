"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importStar(require("react"));
var storeContext_1 = require("./storeContext");
var withStore = function (Component, store) { return function (props) {
    var _a = react_1.useState(store.state), state = _a[0], setState = _a[1];
    var _b = react_1.useState(false), initRender = _b[0], setInitRender = _b[1];
    var _c = react_1.useState(), gettersValues = _c[0], setGettersValues = _c[1];
    var mutations = react_1.useMemo(function () {
        return getMutations(store, setState);
    }, []);
    var actions = react_1.useMemo(function () {
        if (!store.actions)
            return {};
        var values = {};
        Object.keys(store.actions).forEach(function (actionName) {
            var _a;
            var originalFn = (_a = store.actions) === null || _a === void 0 ? void 0 : _a[actionName];
            values[actionName] = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return originalFn.apply(void 0, __spreadArray([{ mutations: mutations, actions: actions }], args));
            };
        });
        return values;
    }, [mutations]);
    var getters = react_1.useMemo(function () {
        if (!store.getters)
            return {};
        var result = {};
        Object.keys(store.getters).forEach(function (getterName) {
            var _a;
            var originalFn = (_a = store.getters) === null || _a === void 0 ? void 0 : _a[getterName];
            var value = originalFn(store.state);
            var context = react_1.createContext(value);
            result[getterName] = context;
        });
        return result;
    }, []);
    react_1.useEffect(function () {
        handleGettersValuesSet(store, state, setGettersValues);
        setInitRender(true);
    }, [state]);
    var MemoizedComponent = react_1.useMemo(function () { return react_1.memo(Component); }, []);
    var getterContexts = react_1.useMemo(function () {
        return renderGetters(react_1.default.createElement(MemoizedComponent, __assign({}, props)), getters, gettersValues);
    }, [getters, gettersValues, MemoizedComponent, props]);
    return (react_1.default.createElement(storeContext_1.MutationsProvider, { value: mutations },
        react_1.default.createElement(storeContext_1.ActionsProvider, { value: actions },
            react_1.default.createElement(storeContext_1.GettersProvider, { value: getters }, initRender && getterContexts))));
}; };
var renderGetters = function (component, gettersContext, gettersValues) {
    if (!gettersValues)
        return component;
    var result = react_1.createElement('div', { children: component });
    Object.keys(gettersValues).forEach(function (getterName) {
        var getterContext = gettersContext[getterName];
        var getterValue = gettersValues[getterName];
        result = react_1.createElement(getterContext.Provider, { children: result, value: getterValue });
    });
    return result;
};
var getMutations = function (store, setState) {
    if (!store.mutations)
        return {};
    var values = {};
    Object.keys(store.mutations).forEach(function (mutationName) {
        var _a;
        var originalFn = (_a = store.mutations) === null || _a === void 0 ? void 0 : _a[mutationName];
        values[mutationName] = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            setState(function (prevState) {
                var newState = __assign({}, prevState);
                originalFn.apply(void 0, __spreadArray([newState], args));
                return newState;
            });
        };
    });
    return values;
};
var handleGettersValuesSet = function (store, state, setGettersValues) {
    if (!store.getters)
        return;
    Object.keys(store.getters).forEach(function (getterName) {
        var _a;
        var originalFn = (_a = store.getters) === null || _a === void 0 ? void 0 : _a[getterName];
        var value = originalFn(state);
        setGettersValues(function (prevValues) {
            var _a;
            if (!prevValues)
                prevValues = {};
            if (typeof prevValues[getterName] === 'undefined') {
                prevValues[getterName] = value;
            }
            else if (prevValues[getterName] !== value) {
                return __assign(__assign({}, prevValues), (_a = {}, _a[getterName] = value, _a));
            }
            return prevValues;
        });
    });
};
exports.default = withStore;
//# sourceMappingURL=withStore.js.map