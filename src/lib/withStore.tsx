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
  const [state, setState] = useState<InheritedStateType>(getStoreStateWithModules<InheritedStateType>(store));
  const [initRender, setInitRender] = useState(false);
  const [gettersValues, setGettersValues] = useState<StateType>();

  const mutations = useMemo(() => {
    return getMutations<InheritedStateType>(store, setState);
  }, []);

  const actions = useMemo(() => {
    const actionsFns = getStoreKeyModuleValues(store, 'actions');
    const actionNames = Object.keys(actionsFns);
    if (!actionNames.length) return {};

    const values: Record<string, (args: any) => any> = {};

    actionNames.forEach(actionName => {
      const originalFn = actionsFns[actionName] as ActionType;
      values[actionName] = (...args: any[]) => originalFn({ mutations, actions }, ...args);
    })

    return values;
  }, [mutations]);

  const getters = useMemo(() => {
    const gettersFns = getStoreKeyModuleValues(store, 'getters');
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
        const moduleStore = getPropByString(store, getterName, true) as StateType;
        value = originalFn(moduleStore.state);
      }

      // const value = originalFn(store.state as StateType);
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
  const mutations = getStoreKeyModuleValues(store, 'mutations');
  const mutationNames = Object.keys(mutations);
  if (!mutationNames.length) return {};

  const values: Record<string, (args: any) => void> = {};

  mutationNames.forEach(mutationName => {
    const originalFn = mutations[mutationName] as MutationType;
    values[mutationName] = (...args) => {
      setState(prevState => {
        const newState: T = { ...prevState }

        const moduleNames = mutationName.split('/');

        // alter the state with the logic given in the store config
        if (moduleNames.length === 1) {
          originalFn(newState, ...args)
        } else {
          const moduleState = getPropByString(newState, mutationName);
          console.log('EEEEK', moduleState)
          originalFn(moduleState, ...args)
        }

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

/**
 * Returns an object with keys and fn values
 * for mutations, actions and getters
 * Accounts for infinite levels of children modules
 * @param store
 * @param storeType
 * @param result
 * @param prefix
 */
const getStoreKeyModuleValues = (store: StoreType, storeType: 'mutations' | 'actions' | 'getters', result: Record<string, Function> = {}, prefix = '') => {
  // get the current key names with added prefix
  if (store[storeType]) {
    let keyNames = Object.keys(store[storeType] ?? {});

    keyNames.forEach(keyName => {
      const keyNameWithPrefix = prefix ? `${prefix}/${keyName}` : keyName;
      Object.assign(result, { [keyNameWithPrefix]: store[storeType]?.[keyName] })
    })
  }

  // check for child modules
  const childModules = Object.keys(store.modules ?? {});
  if (childModules.length) {
    childModules.forEach(moduleName => {
      const childPrefix = prefix ? `${prefix}/${moduleName}` : moduleName;
      if (store.modules) getStoreKeyModuleValues(store.modules[moduleName], storeType, result, childPrefix);
    })
  }

  return result;
}

const getStoreStateWithModules = <InheritedStateType, >(store: StoreType, result: Record<string, any> = {}): InheritedStateType => {
  Object.assign(result, store?.state);

  const childModules = Object.keys(store.modules ?? {});
  if (childModules.length) {
    Object.assign(result, { modules: {} });

    childModules.forEach(moduleName => {
      Object.assign(result.modules, { [moduleName]: {} });
      if (store.modules) getStoreStateWithModules(store.modules[moduleName], result.modules[moduleName]);
    })
  }

  return result as InheritedStateType;
}

function getPropByString(obj: Record<string, any>, propString: string, searchModules = false) {
  if (!propString)
    return obj;

  const props = propString.split('/');
  let prop: string
  let foundPropI

  for (let i = 0, iLen = props.length - 1; i < iLen; i++) {
    prop = props[i];

    const candidate = searchModules ? obj.modules?.[prop] : obj[prop];
    if (candidate !== undefined) {
      console.log('candidate ok', candidate)
      obj = candidate;
      foundPropI = i
    } else {
      break;
    }
  }

  return searchModules ? obj : obj[props[foundPropI]];
}

export default withStore;
