import React, { useMemo, useState, useEffect, createContext, createElement, memo, Context } from 'react';

import { MutationsProvider, ActionsProvider, GettersProvider } from './storeContext';
import { StoreType } from "./types";

const withStore = (Component: (props: any) => JSX.Element, store: StoreType) => (props: any) => {
  const [state, setState] = useState(store.state);
  const [initRender, setInitRender] = useState(false);
  const [gettersValues, setGettersValues] = useState({});

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

    const result: Record<string, Context<any>> = {}

    Object.keys(store.getters).forEach(getterName => {
      const originalFn = store.getters?.[getterName];
      const value = originalFn(store.state);
      const context = createContext(value);

      result[getterName] = context;
    });

    return result;
  }, []);

  useEffect(() => {
    setGetterValues(store, state, setGettersValues);
    setInitRender(true);
  }, [state]);

  const MemoizedComponent = useMemo(() => memo(Component), []);

  // wrapping in useMemo prevents re-creation upon state change
  const getterContexts = useMemo(() => {
    return renderGetters(getters, gettersValues, <MemoizedComponent {...props} />);
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

const renderGetters = (gettersContext, gettersValues, component) => {
  let result = createElement('div', { children: component });

  Object.keys(gettersValues).forEach(getterName => {
    const getterContext = gettersContext[getterName];
    const getterValue = gettersValues[getterName];
    result = createElement(getterContext.Provider, { children: result, value: getterValue });
  })

  return result;
}

const getMutations = (store, setState) => {
  const values = {};

  Object.keys(store.mutations).forEach(mutationName => {
    const originalFn = store.mutations[mutationName];
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

const setGetterValues = (store, state, setGettersValues) => {
  Object.keys(store.getters).forEach(getterName => {
    const originalFn = store.getters[getterName];
    const value = originalFn(state);

    setGettersValues(prevValues => {
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
