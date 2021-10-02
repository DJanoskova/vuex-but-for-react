import { StoreType } from "./types";
/**
 * Returns an object with keys and fn values
 * for mutations, actions and getters
 * Accounts for infinite levels of children modules
 * @param store
 * @param storeType
 * @param result
 * @param prefix
 */
export declare const getStoreKeyModuleValues: (store: StoreType, storeType: 'mutations' | 'actions' | 'getters', result?: Record<string, Function>, prefix?: string) => Record<string, Function>;
export declare const filterObjectModuleKeys: (data: Record<string, any>, keyName: any) => {
    [x: string]: any;
};
