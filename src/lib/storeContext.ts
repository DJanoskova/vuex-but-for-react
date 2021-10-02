import { createContext, memo, Context } from 'react';

import { ActionParamsType } from './types';

export const mutationsContext = createContext<Record<string, (args?: any) => void>>({});
export const MutationsProvider = memo(mutationsContext.Provider);

export const actionsContext = createContext<Record<string, (context: ActionParamsType, args?: any) => Promise<any>>>({});
export const ActionsProvider = memo(actionsContext.Provider);

// this context holds the other contexts for each getter
export const gettersContext = createContext<Record<string, Context<any>>>({});
export const GettersProvider = memo(gettersContext.Provider);
