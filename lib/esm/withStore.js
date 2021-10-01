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
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
import React, { useMemo, useState, useEffect, createContext, createElement, memo } from 'react';
import { MutationsProvider, ActionsProvider, GettersProvider } from './storeContext';
var withStore = function (Component, store) { return function (props) {
    var _a = useState(getStoreStateWithModules(store)), state = _a[0], setState = _a[1];
    var _b = useState(false), initRender = _b[0], setInitRender = _b[1];
    var _c = useState(), gettersValues = _c[0], setGettersValues = _c[1];
    var mutations = useMemo(function () {
        return getMutations(store, setState);
    }, []);
    var actions = useMemo(function () {
        var actionsFns = getStoreKeyModuleValues(store, 'actions');
        var actionNames = Object.keys(actionsFns);
        console.log(actionNames);
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
    var getters = useMemo(function () {
        var gettersFns = getStoreKeyModuleValues(store, 'getters');
        var getterNames = Object.keys(gettersFns);
        if (!getterNames.length)
            return {};
        var result = {};
        getterNames.forEach(function (getterName) {
            console.log(gettersFns);
            var originalFn = gettersFns[getterName];
            var value = originalFn(store.state);
            var context = createContext(value);
            result[getterName] = context;
        });
        return result;
    }, []);
    useEffect(function () {
        handleGettersValuesSet(store, state, setGettersValues);
        setInitRender(true);
    }, [state]);
    var MemoizedComponent = useMemo(function () { return memo(Component); }, []);
    // wrapping in useMemo prevents re-creation upon state change
    var getterContexts = useMemo(function () {
        return renderGetters(React.createElement(MemoizedComponent, __assign({}, props)), getters, gettersValues);
    }, [getters, gettersValues, MemoizedComponent, props]);
    return (React.createElement(MutationsProvider, { value: mutations },
        React.createElement(ActionsProvider, { value: actions },
            React.createElement(GettersProvider, { value: getters }, initRender && getterContexts))));
}; };
var renderGetters = function (component, gettersContext, gettersValues) {
    if (!gettersValues)
        return component;
    var result = createElement('div', { children: component });
    Object.keys(gettersValues).forEach(function (getterName) {
        var getterContext = gettersContext[getterName];
        var getterValue = gettersValues[getterName];
        result = createElement(getterContext.Provider, { children: result, value: getterValue });
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
                // alter the state with the logic given in the store config
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
            getStoreKeyModuleValues(childModules[moduleName], storeType, result, childPrefix);
        });
    }
    return result;
};
var getStoreStateWithModules = function (store, result, prefix) {
    var _a;
    if (result === void 0) { result = {}; }
    if (prefix === void 0) { prefix = ''; }
    Object.assign(result, store.state);
    var childModules = Object.keys((_a = store.modules) !== null && _a !== void 0 ? _a : {});
    if (childModules.length) {
        childModules.forEach(function (moduleName) {
            var childPrefix = prefix ? prefix + "/" + moduleName : moduleName;
            getStoreStateWithModules(childModules[moduleName], result, childPrefix);
        });
    }
    return result;
};
export default withStore;
