# Example - TS

A TypeScript example using `vuex-but-for-react` with a blog-like global state logic

* Check the views/PostsPage for use of an **action** and a **getter**
* Check the views/PostPage for use of an async **action** and storing the data locally.
* Check the components/PostDelete page for use of **action** which dispatches a mutation from the inside.

The store config is as follows:
```typescript
const store = {
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
```

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.
