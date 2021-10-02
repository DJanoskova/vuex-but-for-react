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

export const filterObjectModuleKeys = (data: Record<string, any>, keyName) => {
  const moduleNames = keyName.split('/')
  // remove the last action/mutation name, keep module levels only
  moduleNames.splice(moduleNames.length - 1, 1)

  // from projects/chemistry/POSTS_FETCH -> to projects/chemistry
  const modulePath = moduleNames.join('/') + '/'

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