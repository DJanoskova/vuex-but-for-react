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
    var _a = react_1.useState(getStoreStateWithModules(store)), state = _a[0], setState = _a[1];
    var _b = react_1.useState(false), initRender = _b[0], setInitRender = _b[1];
    var _c = react_1.useState(), gettersValues = _c[0], setGettersValues = _c[1];
    var mutations = react_1.useMemo(function () {
        return getMutations(store, setState);
    }, []);
    var actions = react_1.useMemo(function () {
        var actionsFns = getStoreKeyModuleValues(store, 'actions');
        var actionNames = Object.keys(actionsFns);
        if (!actionNames.length)
            return {};
        var values = {};
        actionNames.forEach(function (actionName) {
            var originalFn = actionsFns[actionName];
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
        var gettersFns = getStoreKeyModuleValues(store, 'getters');
        var getterNames = Object.keys(gettersFns);
        if (!getterNames.length)
            return {};
        var result = {};
        getterNames.forEach(function (getterName) {
            var originalFn = gettersFns[getterName];
            var moduleNames = getterName.split('/');
            var value;
            // alter the state with the logic given in the store config
            if (moduleNames.length === 1) {
                value = originalFn(store.state);
            }
            else {
                var moduleStore = getPropByString(store, getterName, true);
                value = originalFn(moduleStore.state);
            }
            // const value = originalFn(store.state as StateType);
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
    // wrapping in useMemo prevents re-creation upon state change
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
    var mutations = getStoreKeyModuleValues(store, 'mutations');
    var mutationNames = Object.keys(mutations);
    if (!mutationNames.length)
        return {};
    var values = {};
    mutationNames.forEach(function (mutationName) {
        var originalFn = mutations[mutationName];
        values[mutationName] = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            setState(function (prevState) {
                var newState = __assign({}, prevState);
                var moduleNames = mutationName.split('/');
                // alter the state with the logic given in the store config
                if (moduleNames.length === 1) {
                    originalFn.apply(void 0, __spreadArray([newState], args));
                }
                else {
                    var moduleState = getPropByString(newState, mutationName);
                    console.log('EEEEK', moduleState);
                    originalFn.apply(void 0, __spreadArray([moduleState], args));
                }
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
/**
 * Returns an object with keys and fn values
 * for mutations, actions and getters
 * Accounts for infinite levels of children modules
 * @param store
 * @param storeType
 * @param result
 * @param prefix
 */
var getStoreKeyModuleValues = function (store, storeType, result, prefix) {
    var _a, _b;
    if (result === void 0) { result = {}; }
    if (prefix === void 0) { prefix = ''; }
    // get the current key names with added prefix
    if (store[storeType]) {
        var keyNames = Object.keys((_a = store[storeType]) !== null && _a !== void 0 ? _a : {});
        keyNames.forEach(function (keyName) {
            var _a;
            var _b;
            var keyNameWithPrefix = prefix ? prefix + "/" + keyName : keyName;
            Object.assign(result, (_a = {}, _a[keyNameWithPrefix] = (_b = store[storeType]) === null || _b === void 0 ? void 0 : _b[keyName], _a));
        });
    }
    // check for child modules
    var childModules = Object.keys((_b = store.modules) !== null && _b !== void 0 ? _b : {});
    if (childModules.length) {
        childModules.forEach(function (moduleName) {
            var childPrefix = prefix ? prefix + "/" + moduleName : moduleName;
            if (store.modules)
                getStoreKeyModuleValues(store.modules[moduleName], storeType, result, childPrefix);
        });
    }
    return result;
};
var getStoreStateWithModules = function (store, result) {
    var _a;
    if (result === void 0) { result = {}; }
    Object.assign(result, store === null || store === void 0 ? void 0 : store.state);
    var childModules = Object.keys((_a = store.modules) !== null && _a !== void 0 ? _a : {});
    if (childModules.length) {
        Object.assign(result, { modules: {} });
        childModules.forEach(function (moduleName) {
            var _a;
            Object.assign(result.modules, (_a = {}, _a[moduleName] = {}, _a));
            if (store.modules)
                getStoreStateWithModules(store.modules[moduleName], result.modules[moduleName]);
        });
    }
    return result;
};
function getPropByString(obj, propString, searchModules) {
    var _a;
    if (searchModules === void 0) { searchModules = false; }
    if (!propString)
        return obj;
    var props = propString.split('/');
    var prop;
    var foundPropI;
    for (var i = 0, iLen = props.length - 1; i < iLen; i++) {
        prop = props[i];
        var candidate = searchModules ? (_a = obj.modules) === null || _a === void 0 ? void 0 : _a[prop] : obj[prop];
        if (candidate !== undefined) {
            console.log('candidate ok', candidate);
            obj = candidate;
            foundPropI = i;
        }
        else {
            break;
        }
    }
    return searchModules ? obj : obj[props[foundPropI]];
}
exports.default = withStore;
