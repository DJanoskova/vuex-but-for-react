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
import { GettersType, StateType, StoreType } from "./types";

const withStore = (Component: (props: any) => JSX.Element, store: StoreType) => (props: any) => {
  const [state, setState] = useState<StateType>(store.state || {});
  const [initRender, setInitRender] = useState(false);
  const [gettersValues, setGettersValues] = useState<StateType>();

  const mutations = useMemo(() => {
    return getMutations(store, setState);
  }, []);

  const actions = useMemo(() => {
    if (!store.actions) return {};

    const values: Record<string, (args: any) => void> = {};

    Object.keys(store.actions).forEach(actionName => {
      const originalFn = store.actions?.[actionName];
      values[actionName] = (...args: any[]) => {
        originalFn({ mutations, actions }, ...args);
      }
    })

    return values;
  }, [mutations]);

  const getters = useMemo(() => {
    if (!store.getters) return {};

    const result: GettersType = {}

    Object.keys(store.getters).forEach(getterName => {
      const originalFn = store.getters?.[getterName];
      const value = originalFn(store.state);
      const context = createContext(value);

      result[getterName] = context;
    });

    return result;
  }, []);

  useEffect(() => {
    handleGettersValuesSet(store, state, setGettersValues);
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

const renderGetters = (component: JSX.Element, gettersContext: GettersType, gettersValues?: StateType) => {
  if (!gettersValues) return component;

  let result: any = createElement('div', { children: component });

  Object.keys(gettersValues).forEach(getterName => {
    const getterContext = gettersContext[getterName];
    const getterValue = gettersValues[getterName];
    result = createElement(getterContext.Provider, { children: result, value: getterValue });
  })

  return result;
}

const getMutations = (store: StoreType, setState: Dispatch<SetStateAction<StateType>>) => {
  if (!store.mutations) return {};

  const values: Record<string, (args: any) => void> = {};

  Object.keys(store.mutations).forEach(mutationName => {
    const originalFn = store.mutations?.[mutationName];
    values[mutationName] = (...args) => {
      setState(prevState => {
        const newState = { ...prevState }
        originalFn(newState, ...args)
        return newState
      })
    }
  })

  return values;
}

const handleGettersValuesSet = (store: StoreType, state: StateType, setGettersValues: Dispatch<SetStateAction<StateType>>) => {
  if (!store.getters) return;

  Object.keys(store.getters).forEach(getterName => {
    const originalFn = store.getters?.[getterName];
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
