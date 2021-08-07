import { createContext, memo } from 'react';
export var mutationsContext = createContext({});
export var MutationsProvider = memo(mutationsContext.Provider);
export var actionsContext = createContext({});
export var ActionsProvider = memo(actionsContext.Provider);
// this context holds the other contexts for each getter
export var gettersContext = createContext({});
export var GettersProvider = memo(gettersContext.Provider);
