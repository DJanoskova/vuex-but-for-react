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
export declare const getStoreKeyModuleValues: <T>(store: StoreType, storeType: 'mutations' | 'actions' | 'getters', result?: Record<string, T>, prefix?: string) => Record<string, T>;
/**
 * from projects/chemistry/POSTS_FETCH -> to projects/chemistry
 * @param path
 */
export declare const getStoreModuleName: (path: string) => string;
export declare const filterObjectModuleKeys: (data: Record<string, any>, keyName: any) => {
    [x: string]: any;
};
export declare function getStoreModule(obj: Record<string, any>, propString: string): Record<string, any>;
