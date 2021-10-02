const projectsModule =  {
  state: {
    data: [{ id: 1, title: 'test' }]
  },
  mutations: {
    PROJECTS_SET(state, data) {
      console.log(state)
      state.data = data
    }
  },
  actions: {
    async PROJECTS_FETCH(context) {
      console.log(context)
      const response = await fetch('https://jsonplaceholder.typicode.com/posts')
      const data = await response.json()
      context.mutations.PROJECTS_SET(data)
    }
  },
  getters: {
    projects (state) {
      console.log('what state', state)
      return state.data
    }
  }
}

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
      console.log(context)
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
    posts (state) {
      return state.posts
    }
  },
  modules: {
    projects: projectsModule
  }
}

export default store