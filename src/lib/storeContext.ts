import { createContext, memo } from 'react';

import { ActionParamsType } from './types';
import { createStore } from './externalStore';

export const mutationsContext = createContext<Record<string, (...args: any) => void>>({});
export const MutationsProvider = memo(mutationsContext.Provider);

export const actionsContext = createContext<Record<string, (context: ActionParamsType, args?: any) => Promise<any>>>({});
export const ActionsProvider = memo(actionsContext.Provider);

// this context holds the other contexts for each getter
export const globalStoreContext = createContext(createStore({}));
export const GlobalStoreProvider = memo(globalStoreContext.Provider);
