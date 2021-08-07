import { useContext, useEffect } from "react";

import { actionsContext, gettersContext, mutationsContext } from "./storeContext";

export const useAction = <T, >(actionName: string) => {
  const actions = useContext(actionsContext);

  if (!actions[actionName]) {
    throw new Error(`Cannot find action: ${actionName}`)
  }

  return actions[actionName] as (args?: any) => Promise<T>;
}

export const useMutation = (mutationName: string) => {
  const mutations = useContext(mutationsContext);

  if (!mutations[mutationName]) {
    throw new Error(`Cannot find mutation: ${mutationName}`)
  }

  return mutations[mutationName];
}

export const useGetter = <T, >(getterName: string) => {
  const getters = useContext(gettersContext);

  if (!getters[getterName]) {
    throw new Error(`Cannot find getter: ${getterName}`)
  }

  const value = useContext<T>(getters[getterName])

  return value;
}

export const useActionOnMount = <T, >(actionName: string) => {
  const action = useAction<T>(actionName);

  useEffect(() => {
    action();
  }, [action]);
}