const store = {
  state: {
    demoRefreshValue: 0,
    counter: 0,
    posts: []
  },
  mutations: {
    POSTS_SET(state, data) {
      state.posts = data
    },
    COUNTER_INCREMENT(state) {
      state.counter++
    },
    COUNTER_DECREMENT(state) {
      state.counter--
    },
    DEMO_VALUE_SET(state, value) {
      state.demoRefreshValue = value
    }
  },
  actions: {
    async POSTS_FETCH(context) {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts')
      const data = await response.json()
      context.mutations.POSTS_SET(data)
    }
  },
  getters: {
    posts (state) {
      return state.posts
    }
  }
}

export default store