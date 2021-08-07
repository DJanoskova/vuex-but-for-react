import { Context } from 'react';
export declare const mutationsContext: Context<Record<string, (args?: any) => void>>;
export declare const MutationsProvider: import("react").MemoExoticComponent<import("react").Provider<Record<string, (args?: any) => void>>>;
export declare const actionsContext: Context<Record<string, (args?: any) => Promise<any>>>;
export declare const ActionsProvider: import("react").MemoExoticComponent<import("react").Provider<Record<string, (args?: any) => Promise<any>>>>;
export declare const gettersContext: Context<Record<string, Context<any>>>;
export declare const GettersProvider: import("react").MemoExoticComponent<import("react").Provider<Record<string, Context<any>>>>;
