import { Context } from 'react';
import { ActionParamsType } from './types';
export declare const mutationsContext: Context<Record<string, (args?: any) => void>>;
export declare const MutationsProvider: import("react").MemoExoticComponent<import("react").Provider<Record<string, (args?: any) => void>>>;
export declare const actionsContext: Context<Record<string, (context: ActionParamsType, args?: any) => Promise<any>>>;
export declare const ActionsProvider: import("react").MemoExoticComponent<import("react").Provider<Record<string, (context: ActionParamsType, args?: any) => Promise<any>>>>;
export declare const gettersContext: Context<Record<string, Context<any>>>;
export declare const GettersProvider: import("react").MemoExoticComponent<import("react").Provider<Record<string, Context<any>>>>;
