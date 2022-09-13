import { VuexStoreType } from "vuex-but-for-react";

import { PostType } from "./types/types";

const store: VuexStoreType<{ posts: PostType[] }> = {
  state: {
    posts: []
  },
  mutations: {
    POSTS_SET(state, data) {
      state.posts = data
    },
    POST_REMOVE(state, id) {
      state.posts = state.posts.filter((p) => p.id !== id)
    }
  },
  actions: {
    async POSTS_FETCH(context) {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts')
      const data = await response.json()
      context.mutations.POSTS_SET(data.slice(0, 20));
    },
    async POST_FETCH(_, id) {
      const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`)
      const data = await response.json()
      return data;
    },
    async POST_DELETE(context, id) {
      await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
        method: 'DELETE',
      })
      context.mutations.POST_REMOVE(id)
    }
  },
  getters: {
    posts (state) {
      return state.posts
    }
  }
}

export default store