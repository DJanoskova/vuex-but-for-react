import { createContext, useContext, memo, Context } from 'react';

export const mutationsContext = createContext<Record<string, (args?: any) => void>>({});
export const MutationsProvider = memo(mutationsContext.Provider);

export const actionsContext = createContext<Record<string, (args?: any) => Promise<any>>>({});
export const ActionsProvider = memo(actionsContext.Provider);

// this context holds the other contexts for each getter
export const gettersContext = createContext<Record<string, Context<unknown>>>({});
export const GettersProvider = memo(gettersContext.Provider);

export const useAction = (actionName: string) => {
  const actions = useContext(actionsContext);

  return actions[actionName];
}

export const useMutation = (mutationName: string) => {
  const mutations = useContext(mutationsContext);

  return mutations[mutationName];
}

export const useGetter = (getterName: string) => {
  const getters = useContext(gettersContext);
  const value = useContext(getters[getterName])

  return value;
}