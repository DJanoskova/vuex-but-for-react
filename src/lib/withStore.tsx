import React, {
  useMemo,
  useState,
  useEffect,
  createContext,
  createElement,
  memo,
  Dispatch,
  SetStateAction, useRef
} from 'react';

import { MutationsProvider, ActionsProvider, GettersProvider } from './storeContext';
import { ActionType, GettersContextType, GetterType, MutationType, StateType, StoreType } from './types';
import {
  getStoreKeyModuleValues,
  getStoreModuleName,
  getStoreModule,
  getStoreStateWithModules, appendNewObjectValues,
} from './helpers';

const withStore = <InheritedStateType, >(Component: (props: any) => JSX.Element, store: StoreType<InheritedStateType>) => (props: any) => {
  const [state, setState] = useState<InheritedStateType>(() => getStoreStateWithModules<InheritedStateType>(store));
  const stateRef = useRef<InheritedStateType>();
  const [initRender, setInitRender] = useState(false);
  const [gettersValues, setGettersValues] = useState<StateType>();

  const mutations = useMemo(() => {
    return getMutations<InheritedStateType>(store, setState);
  }, []);

  const actions = useMemo(() => {
    const actionsFns = getStoreKeyModuleValues<ActionType>(store, 'actions');
    return actionsFns ?? {};
  }, []);

  const getters = useMemo(() => {
    const gettersFns = getStoreKeyModuleValues<Function>(store, 'getters');
    const getterNames = Object.keys(gettersFns);
    if (!getterNames.length) return {};

    const result: GettersContextType = {}

    getterNames.forEach(getterName => {
      const originalFn = gettersFns[getterName] as GetterType;
      const moduleNames = getterName.split('/');
      let value;

      // alter the state with the logic given in the store config
      if (moduleNames.length === 1) {
        value = originalFn(store.state as StateType);
      } else {
        const moduleStore = getStoreModule(store, getterName) as StateType;
        value = originalFn(moduleStore.state);
      }

      const context = createContext(value);

      result[getterName] = context;
    });

    return result;
  }, []);

  useEffect(() => {
    stateRef.current = JSON.parse(JSON.stringify(state))
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
  const mutations = getStoreKeyModuleValues(store, 'mutations');
  const mutationNames = Object.keys(mutations);
  if (!mutationNames.length) return {};

  const values: Record<string, (args: any) => void> = {};

  mutationNames.forEach(mutationName => {
    const originalFn = mutations[mutationName] as MutationType<T>;
    values[mutationName] = (...args) => {
      setState(prevState => {
        const prevStateCloned: T = JSON.parse(JSON.stringify(prevState));
        const newState: T = {...prevState};
        const moduleNames = mutationName.split('/');

        // alter the state with the logic given in the store config
        if (moduleNames.length === 1) {
          originalFn(newState, ...args)
        } else {
          const moduleName = getStoreModuleName(mutationName);
          const moduleState = getStoreModule(newState, moduleName);
          originalFn(moduleState as T, ...args)
        }

        const newValues: T = appendNewObjectValues(newState, prevStateCloned) as T

        return newValues
      })
    }
  })

  return values;
}

const handleGettersValuesSet = <T, >(store: StoreType, state: T, setGettersValues: Dispatch<SetStateAction<StateType>>) => {
  const getters = getStoreKeyModuleValues(store, 'getters');
  const getterNames = Object.keys(getters);
  if (!getterNames.length) return;

  const clonedState = JSON.parse(JSON.stringify(state));

  getterNames.forEach(getterPath => {
    const moduleNames = getterPath.split('/');
    let originalFn: GetterType<T>;

    // let value;
    // let originalValue;
    let clonedValue;

    // alter the state with the logic given in the store config
    if (moduleNames.length === 1) {
      originalFn = store.getters?.[getterPath] as GetterType<T>;

      // value = originalFn(state);
      clonedValue = originalFn(clonedState);
    } else {
      const moduleStore = getStoreModule(store, getterPath) as StateType;
      // const moduleState = getStoreModule(state, getterPath) as T;
      const clonedModuleState = getStoreModule(clonedState, getterPath) as T;

      const getterName = moduleNames[moduleNames.length - 1]
      originalFn = moduleStore.getters?.[getterName] as GetterType<T>;

      // value = originalFn(moduleState);
      clonedValue = originalFn(clonedModuleState);
    }

    setGettersValues((prevValues) => {
      console.log('\n\n\nprev', prevValues)
      // console.log('val', value)
      if (!prevValues) prevValues = {}

      if (typeof prevValues[getterPath] === 'undefined') {
        prevValues[getterPath] = clonedValue;
      } else {
        console.log('am here defined', getterPath)
        let oldValue = prevValues[getterPath];
        console.log('old', oldValue)
        console.log('new', clonedValue)
        const isEqual = oldValue === clonedValue || JSON.stringify(oldValue) === JSON.stringify(clonedValue);

        // const mergedValue = appendNewObjectValues()

        console.log('is eq', isEqual)
        if (!isEqual) {
          return {
            ...prevValues,
            [getterPath]: clonedValue
          };
        }
      }

      return prevValues;
    })
  });
}

export default withStore;
