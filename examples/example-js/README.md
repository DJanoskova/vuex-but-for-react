# Example - JS

A JavaScript example using `vuex-but-for-react` with a blog-like global state logic

* Check the views/DemoPage for use of a **mutation** and monitoring component re-renders
* Check the views/PostsPage for use of an **action** and a **getter**

The store config is as follows:
```javascript
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
```

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.
