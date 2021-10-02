export declare const useAction: <T>(actionName: string) => (args?: any) => Promise<T>;
export declare const useActions: (values: string[]) => ((args?: any) => Promise<any>)[];
export declare const useMutation: (mutationName: string) => (args?: any) => void;
export declare const useMutations: (values: string[]) => ((args?: any) => void)[];
export declare const useGetter: <T>(getterName: string) => T;
export declare const useGetters: <T extends any[]>(values: string[]) => T;
export declare const useActionOnMount: <T>(actionName: string, ...params: any[]) => void;
