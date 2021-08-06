export interface StoreType {
  state?: Record<string, any>;
  mutations?: Record<string, any>;
  actions?: Record<string, any>;
  getters?: Record<string, any>;
}