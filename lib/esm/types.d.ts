import { Context } from "react";
export interface StoreType<T = unknown> {
    state: T;
    mutations?: Record<string, MutationType>;
    actions?: Record<string, ActionType>;
    getters?: Record<string, GetterType>;
}
interface ActionParamsType {
    mutations: Record<string, MutationType>;
    actions: Record<string, ActionType>;
}
export declare type StateType = Record<string, any>;
export declare type GettersContextType = Record<string, Context<any>>;
export declare type MutationType = (state: StateType, ...args: any) => void;
export declare type ActionType = (context: ActionParamsType, ...args: any) => Promise<any>;
export declare type GetterType = (state: StateType) => any;
export {};
