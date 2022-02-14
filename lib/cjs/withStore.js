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
var helpers_1 = require("./helpers");
var withStore = function (Component, store) { return function (props) {
    var _a = react_1.useState(function () { return helpers_1.getStoreStateWithModules(store); }), state = _a[0], setState = _a[1];
    var stateRef = react_1.useRef();
    var _b = react_1.useState(false), initRender = _b[0], setInitRender = _b[1];
    var _c = react_1.useState(), gettersValues = _c[0], setGettersValues = _c[1];
    var mutations = react_1.useMemo(function () {
        return getMutations(store, setState);
    }, []);
    var actions = react_1.useMemo(function () {
        var actionsFns = helpers_1.getStoreKeyModuleValues(store, 'actions');
        return actionsFns !== null && actionsFns !== void 0 ? actionsFns : {};
    }, []);
    var getters = react_1.useMemo(function () {
        var gettersFns = helpers_1.getStoreKeyModuleValues(store, 'getters');
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
                var moduleStore = helpers_1.getStoreModule(store, getterName);
                value = originalFn(moduleStore.state);
            }
            var context = react_1.createContext(value);
            result[getterName] = context;
        });
        return result;
    }, []);
    react_1.useEffect(function () {
        stateRef.current = JSON.parse(JSON.stringify(state));
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
    var mutations = helpers_1.getStoreKeyModuleValues(store, 'mutations');
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
                var prevStateCloned = JSON.parse(JSON.stringify(prevState));
                var newState = __assign({}, prevState);
                var moduleNames = mutationName.split('/');
                // alter the state with the logic given in the store config
                if (moduleNames.length === 1) {
                    originalFn.apply(void 0, __spreadArray([newState], args));
                }
                else {
                    var moduleName = helpers_1.getStoreModuleName(mutationName);
                    var moduleState = helpers_1.getStoreModule(newState, moduleName);
                    originalFn.apply(void 0, __spreadArray([moduleState], args));
                }
                var newValues = helpers_1.appendNewObjectValues(newState, prevStateCloned);
                return newValues;
            });
        };
    });
    return values;
};
var handleGettersValuesSet = function (store, state, setGettersValues) {
    var getters = helpers_1.getStoreKeyModuleValues(store, 'getters');
    var getterNames = Object.keys(getters);
    if (!getterNames.length)
        return;
    var clonedState = JSON.parse(JSON.stringify(state));
    getterNames.forEach(function (getterPath) {
        var _a, _b;
        var moduleNames = getterPath.split('/');
        var originalFn;
        // let value;
        // let originalValue;
        var clonedValue;
        var oldValueStringified;
        setGettersValues(function (prevValues) {
            oldValueStringified = JSON.stringify(prevValues || {});
            return prevValues;
        });
        // alter the state with the logic given in the store config
        if (moduleNames.length === 1) {
            originalFn = (_a = store.getters) === null || _a === void 0 ? void 0 : _a[getterPath];
            // value = originalFn(state);
            clonedValue = originalFn(clonedState);
        }
        else {
            var moduleStore = helpers_1.getStoreModule(store, getterPath);
            // const moduleState = getStoreModule(state, getterPath) as T;
            var clonedModuleState = helpers_1.getStoreModule(clonedState, getterPath);
            var getterName = moduleNames[moduleNames.length - 1];
            originalFn = (_b = moduleStore.getters) === null || _b === void 0 ? void 0 : _b[getterName];
            // value = originalFn(moduleState);
            clonedValue = originalFn(clonedModuleState);
        }
        setGettersValues(function (prevValues) {
            var _a;
            console.log('\n\n\nprev', prevValues);
            // console.log('val', value)
            if (!prevValues)
                prevValues = {};
            if (typeof prevValues[getterPath] === 'undefined') {
                prevValues[getterPath] = clonedValue;
            }
            else {
                console.log('am here defined', getterPath);
                var prevValuesCloned = JSON.parse(oldValueStringified);
                var oldValue = prevValuesCloned[getterPath];
                console.log('old', oldValue);
                console.log('new', clonedValue);
                var isEqual = JSON.stringify(oldValue) === JSON.stringify(clonedValue);
                // const mergedValue = appendNewObjectValues()
                console.log('is eq', isEqual);
                if (!isEqual) {
                    var newValue = helpers_1.appendNewObjectValues(clonedValue, oldValue);
                    console.log('new val', newValue);
                    return __assign(__assign({}, prevValues), (_a = {}, _a[getterPath] = newValue, _a));
                }
            }
            return prevValues;
        });
    });
};
exports.default = withStore;
