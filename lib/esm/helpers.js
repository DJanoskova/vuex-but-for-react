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
/**
 * Returns an object with keys and fn values
 * for mutations, actions and getters
 * Accounts for infinite levels of children modules
 * @param store
 * @param storeType
 * @param result
 * @param prefix
 */
export var getStoreKeyModuleValues = function (store, storeType, result, prefix) {
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
export var filterObjectModuleKeys = function (data, keyName) {
    var moduleNames = keyName.split('/');
    // remove the last action/mutation name, keep module levels only
    moduleNames.splice(moduleNames.length - 1, 1);
    // from projects/chemistry/POSTS_FETCH -> to projects/chemistry
    var modulePath = moduleNames.join('/') + '/';
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