import { useCallback, useContext, useEffect } from "react";

import { actionsContext, globalGettersContext, globalStoreContext, mutationsContext } from "./storeContext";
import { filterObjectModuleKeys } from "./helpers";
import { ExternalStoreType, useStore } from './externalStore';

export const useAction = <T, >(actionName: string) => {
  const globalStore = useContext(globalStoreContext);
  const actions = useContext(actionsContext);
  const mutations = useContext(mutationsContext);
  const action = actions[actionName];

  if (!action) {
    throw new Error(`Cannot find action: ${actionName}`)
  }

  const actionWithStoreParams = useCallback<(...args: any) => Promise<T>>((...args: any[]) => {
    if (!globalStore) throw new Error('No store found');

    const moduleNames = actionName.split('/');
    let filteredActions = actions;
    let filteredMutations = mutations;

    if (moduleNames.length > 1) {
      filteredActions = filterObjectModuleKeys(actions, actionName);
      filteredMutations = filterObjectModuleKeys(mutations, actionName);
    }

    return action({ actions: filteredActions, mutations: filteredMutations, state: globalStore.getState() }, ...args);
  }, [actions, mutations, actionName])

  return actionWithStoreParams;
}

export const useActions = (values: string[]) => {
  const actions = useContext(actionsContext);

  const result: Array<(args?: any) => Promise<any>> = [];

  values.forEach((actionName) => {
    if (!actions[actionName]) {
      throw new Error(`Cannot find action: ${actionName}`);
    } else {
      result.push(actions[actionName]);
    }
  });

  return result;
}

export const useMutation = (mutationName: string) => {
  const mutations = useContext(mutationsContext);

  if (!mutations[mutationName]) {
    throw new Error(`Cannot find mutation: ${mutationName}`)
  }

  return mutations[mutationName];
}

export const useMutations = (values: string[]) => {
  const mutations = useContext(mutationsContext);

  const result: Array<(...args: any) => void> = [];

  values.forEach((mutationName) => {
    if (!mutations[mutationName]) {
      throw new Error(`Cannot find mutation: ${mutationName}`);
    } else {
      result.push(mutations[mutationName]);
    }
  });

  return result;
}

export const useGetter = <T,>(getterName: string): T => {
  const gettersStore = useContext(globalGettersContext);
  const value = useStore<T>(gettersStore.current as ExternalStoreType<T>, getterName);

  return value;
}

export const useActionOnMount = <T, >(actionName: string, ...params) => {
  const action = useAction<T>(actionName);

  useEffect(() => {
    action(...params);
  }, [action, ...params]);
}
