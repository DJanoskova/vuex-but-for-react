import React, {
  useMemo,
  useState,
  useEffect,
  createContext,
  createElement,
  memo,
  Dispatch,
  SetStateAction
} from 'react';

import { MutationsProvider, ActionsProvider, GettersProvider } from './storeContext';
import { ActionType, GettersContextType, GetterType, MutationType, StateType, StoreType } from "./types";

const withStore = <InheritedStateType, >(Component: (props: any) => JSX.Element, store: StoreType<InheritedStateType>) => (props: any) => {
  const [state, setState] = useState<InheritedStateType>(store.state);
  const [initRender, setInitRender] = useState(false);
  const [gettersValues, setGettersValues] = useState<StateType>();

  const mutations = useMemo(() => {
    return getMutations<InheritedStateType>(store, setState);
  }, []);

  const actions = useMemo(() => {
    if (!store.actions) return {};

    const values: Record<string, (args: any) => any> = {};

    Object.keys(store.actions).forEach(actionName => {
      const originalFn = store.actions?.[actionName] as ActionType;
      values[actionName] = (...args: any[]) => originalFn({ mutations, actions }, ...args);
    })

    return values;
  }, [mutations]);

  const getters = useMemo(() => {
    if (!store.getters) return {};

    const result: GettersContextType = {}

    Object.keys(store.getters).forEach(getterName => {
      const originalFn = store.getters?.[getterName] as GetterType;
      const value = originalFn(store.state as StateType);
      const context = createContext(value);

      result[getterName] = context;
    });

    return result;
  }, []);

  useEffect(() => {
    handleGettersValuesSet<InheritedStateType>(store, state, setGettersValues);
    setInitRender(true);
  }, [state]);

  const MemoizedComponent = useMemo(() => memo(Component), []);

  // wrapping in useMemo prevents re-creation upon state change
  const getterContexts = useMemo(() => {
    return renderGetters(<MemoizedComponent {...props} />, getters, gettersValues);
  }, [getters, gettersValues, MemoizedComponent, props])

  return (
    <MutationsProvider value={mutations}>
      <ActionsProvider value={actions}>
        <GettersProvider value={getters}>
          {initRender && getterContexts}
        </GettersProvider>
      </ActionsProvider>
    </MutationsProvider>
  );
}

const renderGetters = (component: JSX.Element, gettersContext: GettersContextType, gettersValues?: StateType) => {
  if (!gettersValues) return component;

  let result: any = createElement('div', { children: component });

  Object.keys(gettersValues).forEach(getterName => {
    const getterContext = gettersContext[getterName];
    const getterValue = gettersValues[getterName];
    result = createElement(getterContext.Provider, { children: result, value: getterValue });
  })

  return result;
}

const getMutations = <T, >(store: StoreType, setState: Dispatch<SetStateAction<T>>) => {
  if (!store.mutations) return {};

  const values: Record<string, (args: any) => void> = {};

  Object.keys(store.mutations).forEach(mutationName => {
    const originalFn = store.mutations?.[mutationName] as MutationType;
    values[mutationName] = (...args) => {
      setState(prevState => {
        const newState: T = { ...prevState }
        // alter the state with the logic given in the store config
        originalFn(newState, ...args)
        return newState
      })
    }
  })

  return values;
}

const handleGettersValuesSet = <T, >(store: StoreType, state: T, setGettersValues: Dispatch<SetStateAction<StateType>>) => {
  if (!store.getters) return;

  Object.keys(store.getters).forEach(getterName => {
    const originalFn = store.getters?.[getterName] as GetterType;
    const value = originalFn(state);

    setGettersValues(prevValues => {
      if (!prevValues) prevValues = {}

      if (typeof prevValues[getterName] === 'undefined') {
        prevValues[getterName] = value;
      } else if (prevValues[getterName] !== value) {
        return {
          ...prevValues,
          [getterName]: value
        };
      }
      return prevValues;
    })
  });
}

export default withStore;
