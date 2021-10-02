"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useGetters = exports.useGetter = exports.useMutations = exports.useMutation = exports.useActionOnMount = exports.useActions = exports.useAction = exports.withStore = void 0;
var withStore_1 = require("./withStore");
Object.defineProperty(exports, "withStore", { enumerable: true, get: function () { return __importDefault(withStore_1).default; } });
var hooks_1 = require("./hooks");
Object.defineProperty(exports, "useAction", { enumerable: true, get: function () { return hooks_1.useAction; } });
Object.defineProperty(exports, "useActions", { enumerable: true, get: function () { return hooks_1.useActions; } });
Object.defineProperty(exports, "useActionOnMount", { enumerable: true, get: function () { return hooks_1.useActionOnMount; } });
Object.defineProperty(exports, "useMutation", { enumerable: true, get: function () { return hooks_1.useMutation; } });
Object.defineProperty(exports, "useMutations", { enumerable: true, get: function () { return hooks_1.useMutations; } });
Object.defineProperty(exports, "useGetter", { enumerable: true, get: function () { return hooks_1.useGetter; } });
Object.defineProperty(exports, "useGetters", { enumerable: true, get: function () { return hooks_1.useGetters; } });
