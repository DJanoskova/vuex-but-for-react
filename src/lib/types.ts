import { StateType } from './externalStore';

export interface VuexStoreType<T = unknown> {
  state: T;
  mutations?: Record<string, MutationType<T>>;
  actions?: Record<string, ActionType<T>>;
  getters?: Record<string, GetterType<T>>;
  modules?: Record<string, VuexStoreType>;
}

export interface ActionParamsType<T = unknown> {
  mutations: Record<string, MutationType<T>>;
  actions: Record<string, ActionType<T>>;
  state: StateType<T>;
}

export interface MutationType<T = unknown> {
  (state: T, ...args: any): void;
}
export interface ActionType<T = unknown> {
  (context: ActionParamsType<T>, ...args: any): Promise<any>
}
export interface GetterType<T = unknown> {
  (state: T): any
}

export interface StoreOptionsType {
  localStorageName?: string; // if you wish to have synchronized state with local storage, provide the name
}