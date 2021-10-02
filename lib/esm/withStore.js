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
import { getStoreKeyModuleValues, getStoreModuleName, getStoreModule } from "./helpers";
var withStore = function (Component, store) { return function (props) {
    var _a = useState(getStoreStateWithModules(store)), state = _a[0], setState = _a[1];
    var _b = useState(false), initRender = _b[0], setInitRender = _b[1];
    var _c = useState(), gettersValues = _c[0], setGettersValues = _c[1];
    console.log('current state', state);
    var mutations = useMemo(function () {
        return getMutations(store, setState);
    }, []);
    var actions = useMemo(function () {
        var actionsFns = getStoreKeyModuleValues(store, 'actions');
        return actionsFns !== null && actionsFns !== void 0 ? actionsFns : {};
    }, []);
    var getters = useMemo(function () {
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
                var moduleStore = getStoreModule(store, getterName);
                value = originalFn(moduleStore.state);
            }
            // const value = originalFn(store.state as StateType);
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
                var moduleNames = mutationName.split('/');
                // alter the state with the logic given in the store config
                if (moduleNames.length === 1) {
                    originalFn.apply(void 0, __spreadArray([newState], args));
                }
                else {
                    var moduleName = getStoreModuleName(mutationName);
                    var moduleState = getStoreModule(newState, moduleName);
                    originalFn.apply(void 0, __spreadArray([moduleState], args));
                }
                return newState;
            });
        };
    });
    return values;
};
var handleGettersValuesSet = function (store, state, setGettersValues) {
    var getters = getStoreKeyModuleValues(store, 'getters');
    var getterNames = Object.keys(getters);
    if (!getterNames.length)
        return;
    getterNames.forEach(function (getterPath) {
        var _a, _b;
        var moduleNames = getterPath.split('/');
        var originalFn;
        var value;
        // alter the state with the logic given in the store config
        if (moduleNames.length === 1) {
            originalFn = (_a = store.getters) === null || _a === void 0 ? void 0 : _a[getterPath];
            value = originalFn(state);
        }
        else {
            var moduleStore = getStoreModule(store, getterPath);
            var moduleState = getStoreModule(state, getterPath);
            var getterName = moduleNames[moduleNames.length - 1];
            originalFn = (_b = moduleStore.getters) === null || _b === void 0 ? void 0 : _b[getterName];
            value = originalFn(moduleState);
        }
        setGettersValues(function (prevValues) {
            var _a;
            if (!prevValues)
                prevValues = {};
            if (typeof prevValues[getterPath] === 'undefined') {
                prevValues[getterPath] = value;
            }
            else if (prevValues[getterPath] !== value) {
                return __assign(__assign({}, prevValues), (_a = {}, _a[getterPath] = value, _a));
            }
            return prevValues;
        });
    });
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
export default withStore;
