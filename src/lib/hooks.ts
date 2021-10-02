import { useContext, useEffect } from "react";

import { actionsContext, gettersContext, mutationsContext } from "./storeContext";
import { filterObjectModuleKeys } from "./helpers";

export const useAction = <T, >(actionName: string) => {
  const actions = useContext(actionsContext);
  const mutations = useContext(mutationsContext);
  const action = actions[actionName];

  if (!action) {
    throw new Error(`Cannot find action: ${actionName}`)
  }

  const moduleNames = actionName.split('/');
  let filteredActions = actions;
  let filteredMutations = mutations;

  if (moduleNames.length > 1) {
    filteredActions = filterObjectModuleKeys(actions, actionName);
    filteredMutations = filterObjectModuleKeys(mutations, actionName);
  }

  const actionWithStoreParams = (...args: any[]) => action({ actions: filteredActions, mutations: filteredMutations }, ...args);

  return actionWithStoreParams as (args?: any) => Promise<T>;
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

  const result: Array<(args?: any) => void> = [];

  values.forEach((mutationName) => {
    if (!mutations[mutationName]) {
      throw new Error(`Cannot find mutation: ${mutationName}`);
    } else {
      result.push(mutations[mutationName]);
    }
  });

  return result;
}

export const useGetter = <T, >(getterName: string): T => {
  const getters = useContext(gettersContext);

  if (!getters[getterName]) {
    throw new Error(`Cannot find getter: ${getterName}`)
  }

  const value = useContext<T>(getters[getterName])

  return value;
}

export const useGetters = <T extends Array<any>, >(values: string[]): T => {
  const getters = useContext(gettersContext);
  const result: any[] = [];

  values.forEach(getterName => {
    if (!getters[getterName]) {
      throw new Error(`Cannot find getter: ${getterName}`);
    } else {
      const value = useContext(getters[getterName]);
      result.push(value)
    }
  })

  return result as T;
}

export const useActionOnMount = <T, >(actionName: string, ...params) => {
  const action = useAction<T>(actionName);

  useEffect(() => {
    action(...params);
  }, [action, ...params]);
}