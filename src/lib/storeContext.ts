import { createContext, memo, Context } from 'react';

export const mutationsContext = createContext<Record<string, (args?: any) => void>>({});
export const MutationsProvider = memo(mutationsContext.Provider);

export const actionsContext = createContext<Record<string, (args?: any) => Promise<any>>>({});
export const ActionsProvider = memo(actionsContext.Provider);

// this context holds the other contexts for each getter
export const gettersContext = createContext<Record<string, Context<any>>>({});
export const GettersProvider = memo(gettersContext.Provider);
