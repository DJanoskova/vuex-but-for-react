const projectsModule =  {
  state: {
    data: [{ id: 1, title: 'Dummy project' }]
  },
  mutations: {
    PROJECTS_SET(state, data) {
      state.data = data
    }
  },
  actions: {
    async PROJECTS_FETCH(context) {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts')
      const data = await response.json()
      context.mutations.PROJECTS_SET(data.splice(20, 20))
    }
  },
  getters: {
    projects (state) {
      return state.data
    }
  }
}

const store = {
  state: {
    demoRefreshValue: 0,
    counter: 0,
    // use nested structure to showcase deep reactivity
    blog: {
      name: 'My Blog!',
      posts: []
    },
    test: [],
  },
  mutations: {
    POSTS_SET(state, data) {
      state.blog.posts = data
    },
    POST_REMOVE(state, id) {
      state.blog.posts = state.blog.posts.filter(p => p.id !== id)
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
    demoRefreshValue(state) {
      return state.demoRefreshValue
    },
    counter (state) {
      return state.counter
    },
    blog (state) {
      return state.blog
    },
    test (state) {
      return state.test
    }
  },
  modules: {
    projects: projectsModule
  }
}

export default store