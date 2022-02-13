import { Context } from "react";
export interface StoreType<T = unknown> {
    state: T;
    mutations?: Record<string, MutationType<T>>;
    actions?: Record<string, ActionType<T>>;
    getters?: Record<string, GetterType<T>>;
    modules?: Record<string, StoreType>;
}
export interface ActionParamsType<T = unknown> {
    mutations: Record<string, MutationType<T>>;
    actions: Record<string, ActionType<T>>;
}
export declare type StateType = Record<string, any>;
export declare type GettersContextType = Record<string, Context<any>>;
export interface MutationType<T = unknown> {
    (state: T, ...args: any): void;
}
export interface ActionType<T = unknown> {
    (context: ActionParamsType<T>, ...args: any): Promise<any>;
}
export interface GetterType<T = unknown> {
    (state: T): any;
}
