import { Context } from "react";

export interface StoreType {
  state?: Record<string, any>;
  mutations?: Record<string, any>;
  actions?: Record<string, any>;
  getters?: Record<string, any>;
}

export type StateType =  Record<string, any>;
export type GettersType = Record<string, Context<any>>