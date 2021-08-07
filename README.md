# Vuex - But for React!

If you know `vuex`, you know it's as close as we get to a perfect state management library. What if we could do this in the react world?

`store.js`
```javascript
const store = {
  state: {
    posts: []
  },
  mutations: {
    POSTS_SET(state, data) {
      state.posts = data
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

`index.js`
```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import { withStore } from 'vuex-but-for-react';

import App from './App';
import store from './store';

const AppWithStore = withStore(App, store);

ReactDOM.render(
  <AppWithStore />,
  document.getElementById('root')
);
```

`Posts.js`
```javascript
import React, { useEffect } from 'react';
import { useAction, useGetter } from 'vuex-but-for-react';

const Posts = () => {
  const handleAction = useAction('POSTS_FETCH');
  const posts = useGetter('posts');

  useEffect(() => {
    handleAction();
  }, [handleAction]) // don't worry, it doesn't re-create!
  
  return (
    <ul>
      {posts.map(post => <li key={post.id}>{post.title}</li>)}
    </ul>
  );
}

export default Posts
```

## Installation

`npm install vuex-but-for-react --save`

`yarn add vuex-but-for-react`

## What's going on?

This library uses React's *Context* API under the hood. The `withStore()` higher order component is creating several contexts:
* A context provider for **actions**, wrapped in a `memo()` to prevent re-creating
* A context provider for **mutations**, wrapped in a `memo()` to prevent re-creating
* A context provider for a collection of **getter contexts**, wrapped in a `memo()` to prevent re-creating
* Dynamically created context (and provider) for *each one of your getters*. This allows us using `useGetter()` inside a component, which always attaches to its own context. It's an alternative solution to a single-state object context.
Updating a getter's provider value will not affect other getters' provider value.
* Under those contexts, there's the provided `App` component, wrapped in a `memo()` to prevent re-creating. Even if the parent context providers change value, **App won't re-render** and neither will its children, unless they're connected to *the* getter that was changed.  