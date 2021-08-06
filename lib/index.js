"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useGetter = exports.useMutation = exports.useAction = exports.withStore = void 0;
var withStore_1 = require("./withStore");
Object.defineProperty(exports, "withStore", { enumerable: true, get: function () { return __importDefault(withStore_1).default; } });
var storeContext_1 = require("./storeContext");
Object.defineProperty(exports, "useAction", { enumerable: true, get: function () { return storeContext_1.useAction; } });
Object.defineProperty(exports, "useMutation", { enumerable: true, get: function () { return storeContext_1.useMutation; } });
Object.defineProperty(exports, "useGetter", { enumerable: true, get: function () { return storeContext_1.useGetter; } });
//# sourceMappingURL=index.js.map