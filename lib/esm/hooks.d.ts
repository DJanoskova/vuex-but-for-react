export declare const useAction: <T>(actionName: string) => (args?: any) => Promise<T>;
export declare const useMutation: (mutationName: string) => (args?: any) => void;
export declare const useGetter: <T>(getterName: string) => T;
export declare const useActionOnMount: <T>(actionName: string) => void;
