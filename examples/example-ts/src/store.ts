import { StoreType } from "vuex-but-for-react";

const store: StoreType<{ posts: any[] }> = {
  state: {
    posts: []
  },
  mutations: {
    SET_POSTS(state, data) {
      state.posts = data
    },
    REMOVE_POST(state, id) {
      state.posts = state.posts.filter(p => p.id !== id)
    }
  },
  actions: {
    async FETCH_POSTS(context) {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts')
      const data = await response.json()
      context.mutations.SET_POSTS(data)
    },
    async FETCH_POST(_, id) {
      const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`)
      const data = await response.json()
      return data
    },
    async DELETE_POST(context, id) {
      await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
        method: 'DELETE',
      })
      context.mutations.REMOVE_POST(id)
    }
  },
  getters: {
    posts (state) {
      return state.posts
    }
  }
}

export default store