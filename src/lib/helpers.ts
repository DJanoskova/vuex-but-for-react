import {StoreType} from "./types";

/**
 * Returns an object with keys and fn values
 * for mutations, actions and getters
 * Accounts for infinite levels of children modules
 * @param store
 * @param storeType
 * @param result
 * @param prefix
 */
export const getStoreKeyModuleValues = <T, >(store: StoreType, storeType: 'mutations' | 'actions' | 'getters', result: Record<string, T> = {}, prefix = '') => {
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

/**
 * from projects/chemistry/POSTS_FETCH -> to projects/chemistry
 * @param path
 */
export const getStoreModuleName = (path: string) => {
  const moduleNames = path.split('/')
  // remove the last action/mutation name, keep module levels only
  moduleNames.splice(moduleNames.length - 1, 1)

  return moduleNames.join('/') + '/'
}

export const filterObjectModuleKeys = (data: Record<string, any>, keyName) => {
  const modulePath = getStoreModuleName(keyName)

  const clonedData = { ...data }

  Object.keys(clonedData).forEach(key => {
    if (key.includes(modulePath)) {
      // store the module data in the root
      const data = clonedData[key]
      clonedData[key.replace(modulePath, '')] = data
    }
    delete clonedData[key]
  })

  return clonedData;
}

export function getStoreModule(obj: Record<string, any>, propString: string) {
  if (!propString)
    return obj;

  let clonedOriginal = { ...obj }

  const props = propString.split('/');
  let prop: string

  for (let i = 0, iLen = props.length - 1; i < iLen; i++) {
    prop = props[i];

    const candidate = clonedOriginal.modules?.[prop];
    if (candidate !== undefined) {
      clonedOriginal = candidate;
    } else {
      break;
    }
  }

  return clonedOriginal;
}

export const getStoreStateWithModules = <InheritedStateType, >(store: StoreType, result: Record<string, any> = {}): InheritedStateType => {
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
