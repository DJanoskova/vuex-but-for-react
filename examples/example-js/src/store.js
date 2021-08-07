const store = {
  state: {
    posts: []
  },
  actions: {
    async POSTS_FETCH(context) {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts/')
      const data = await response.json()
      context.mutations.POSTS_SET(data)
    }
  },
  mutations: {
    POSTS_SET(state, data) {
      state.posts = data
    }
  },
  getters: {
    posts(state) {
      return state.posts
    }
  }
}

export default store