const store = {
  state: {
    posts: null,
    count: 0
  },
  mutations: {
    SET_POSTS (state, posts) {
      state.posts = posts
    },
    SET_COUNTER_INCREMENT (state) {
      state.count++
    }
  },
  actions: {
    async FETCH_POSTS(context) {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts')
      const data = await response.json()
      context.mutations.SET_POSTS(data)
    }
  },
  getters: {
    posts (state) {
      return state.posts
    },
    counter (state) {
      return state.count
    }
  }
}

export default store