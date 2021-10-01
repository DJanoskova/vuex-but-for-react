import { Context } from "react";

export interface StoreType<T = unknown> {
  state: T;
  mutations?: Record<string, MutationType>;
  actions?: Record<string, ActionType>;
  getters?: Record<string, GetterType>;
  modules?: Record<string, StoreType>;
}

interface ActionParamsType {
  mutations: Record<string, MutationType>;
  actions: Record<string, ActionType>;
}

export type StateType = Record<string, any>;
export type GettersContextType = Record<string, Context<any>>

export type MutationType = (state: StateType, ...args: any) => void;
export type ActionType = (context: ActionParamsType, ...args: any) => Promise<any>;
export type GetterType = (state: StateType) => any