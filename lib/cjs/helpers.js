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
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appendNewObjectValues = exports.getStoreStateWithModules = exports.getStoreModule = exports.filterObjectModuleKeys = exports.getStoreModuleName = exports.getStoreKeyModuleValues = void 0;
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
                exports.getStoreKeyModuleValues(store.modules[moduleName], storeType, result, childPrefix);
        });
    }
    return result;
};
exports.getStoreKeyModuleValues = getStoreKeyModuleValues;
/**
 * from projects/chemistry/POSTS_FETCH -> to projects/chemistry
 * @param path
 */
var getStoreModuleName = function (path) {
    var moduleNames = path.split('/');
    // remove the last action/mutation name, keep module levels only
    moduleNames.splice(moduleNames.length - 1, 1);
    return moduleNames.join('/') + '/';
};
exports.getStoreModuleName = getStoreModuleName;
var filterObjectModuleKeys = function (data, keyName) {
    var modulePath = exports.getStoreModuleName(keyName);
    var clonedData = __assign({}, data);
    Object.keys(clonedData).forEach(function (key) {
        if (key.includes(modulePath)) {
            // store the module data in the root
            var data_1 = clonedData[key];
            clonedData[key.replace(modulePath, '')] = data_1;
        }
        delete clonedData[key];
    });
    return clonedData;
};
exports.filterObjectModuleKeys = filterObjectModuleKeys;
function getStoreModule(obj, propString) {
    var _a;
    if (!propString)
        return obj;
    var clonedOriginal = __assign({}, obj);
    var props = propString.split('/');
    var prop;
    for (var i = 0, iLen = props.length - 1; i < iLen; i++) {
        prop = props[i];
        var candidate = (_a = clonedOriginal.modules) === null || _a === void 0 ? void 0 : _a[prop];
        if (candidate !== undefined) {
            clonedOriginal = candidate;
        }
        else {
            break;
        }
    }
    return clonedOriginal;
}
exports.getStoreModule = getStoreModule;
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
                exports.getStoreStateWithModules(store.modules[moduleName], result.modules[moduleName]);
        });
    }
    return result;
};
exports.getStoreStateWithModules = getStoreStateWithModules;
/**
 * @param newObject
 * @param prevObject
 * @param result
 */
function appendNewObjectValues(newObject, prevObject, result) {
    if (newObject === void 0) { newObject = {}; }
    if (prevObject === void 0) { prevObject = {}; }
    if (result === void 0) { result = {}; }
    Object.keys(newObject).forEach(function (key) {
        var newValue = newObject === null || newObject === void 0 ? void 0 : newObject[key];
        var prevValue = prevObject === null || prevObject === void 0 ? void 0 : prevObject[key];
        if (typeof newValue === 'object') {
            var isEqual = JSON.stringify(newValue) === JSON.stringify(prevValue);
            if (isEqual) {
                result[key] = newValue;
            }
            else {
                if (Array.isArray(newValue)) {
                    // modifying an existing array element because length is the same, needs deeper comparison
                    if (newValue.length === prevValue.length) {
                        result[key] = [];
                        newValue.forEach(function (v, index) {
                            if (typeof v === 'object') {
                                var oldV = prevValue[index];
                                if (JSON.stringify(v) === JSON.stringify(oldV)) {
                                    result[key].push(v);
                                }
                                else {
                                    if (Array.isArray(v)) {
                                        result[key].push(__spreadArray([], v));
                                    }
                                    else {
                                        result[key].push(appendNewObjectValues(v, oldV));
                                    }
                                }
                            }
                            else {
                                result[key] = v;
                            }
                        });
                    }
                    else {
                        // removing or adding to array
                        result[key] = __spreadArray([], newValue);
                    }
                }
                else {
                    result[key] = {};
                    appendNewObjectValues(newValue, prevValue, result[key]);
                }
            }
        }
        else {
            if (newValue === prevValue) {
                result[key] = newValue;
            }
        }
    });
    return result;
}
exports.appendNewObjectValues = appendNewObjectValues;
