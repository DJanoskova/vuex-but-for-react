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
    var _a = useState(store.state), state = _a[0], setState = _a[1];
    var _b = useState(false), initRender = _b[0], setInitRender = _b[1];
    var _c = useState(), gettersValues = _c[0], setGettersValues = _c[1];
    var mutations = useMemo(function () {
        return getMutations(store, setState);
    }, []);
    var actions = useMemo(function () {
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
    var getters = useMemo(function () {
        if (!store.getters)
            return {};
        var result = {};
        Object.keys(store.getters).forEach(function (getterName) {
            var _a;
            var originalFn = (_a = store.getters) === null || _a === void 0 ? void 0 : _a[getterName];
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
export default withStore;
