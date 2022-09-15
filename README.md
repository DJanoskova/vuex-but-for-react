# Vuex - But for React! ⚛

Enjoy the vuex API in your React applications with `vuex-but-for-react`, which uses only React Context and React use-sync-external-store under the hood.

`vuex-but-for-react` was engineered with developer experience in mind, making it very easy to use. Invoke your getter or action by using a one-line hook and don't worry about unnecessary renders - **without** using `memo`.

Your component will render only when its getter changes - and it doesn't care about the rest of the store!

Are you on board? Read more 👇

## Installation

`npm install vuex-but-for-react --save`

`yarn add vuex-but-for-react`

TS support included ✨

---

🚨 React versions

**`vuex-but-for-react` >= `3.0.0` works with React `18.0.0`+**

To use with older react versions, please install `vuex-but-for-react 2.0.6`

## Working example

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

Check the <a href="https://github.com/DJanoskova/vuex-but-for-react/tree/master/examples">examples</a> section to see JavaScript and TypeScript working apps!

## API

### useAction(`actionName`)

An action is used for async data logic, especially API calls. You can dispatch mutations and other actions from within an action.

The function returned by the `useAction()` hook is *never* re-created.

```javascript
import { useAction } from 'vuex-but-for-react';

const PostsPage = () => {
  const handleFetch = useAction('POSTS_FETCH');

  useEffect(() => {
    handleFetch();
  }, [handleFetch])

  return (
    ...
  )
}
```

### useMutation(`actionName`)

A mutation is used for sync data operations. It has access to the current state in order to alter it.

The function returned by the `useMutation()` hook is *never* re-created.

```javascript
import { useMutation } from 'vuex-but-for-react';

const Counter = () => {
  const handleIncrement = useMutation('COUNTER_INCREMENT');
  const handleDecrement = useMutation('COUNTER_DECREMENT');

  return (
    <>
      <button onClick={handleDecrement}>-</button>
      <button onClick={handleIncrement}>+</button>
    </>
  )
}
```

### useGetter(`actionName`)
A getter gives you the current stored value based on your config. It has access to the current state.

The data returned by the `useGetter()` hook is updated *only in case the shallow value changes*.
An update of one getter value won't trigger the update of another getter value.

```javascript
import { useGetter } from 'vuex-but-for-react';

const PostsPage = () => {
  const posts = useGetter('posts');

  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}
```

### withStore(`Component`, `config`)

In order to initialize the global store, wrap your (chosen) root component in your store config.

```javascript
import { withStore } from 'vuex-but-for-react';

const AppWithStore = withStore(App, store);
```

And more amazing stuff!

#### useActionOnMount(`actionName`)

Avoid calling useEffect manually. Just pass the action name and it will be executed on component mount automatically.

```javascript
import { useActionOnMount, useGetter } from 'vuex-but-for-react';

const PostsPage = () => {
  useActionOnMount('POSTS_FETCH');
  const posts = useGetter('posts');

  return (
    ...
  )
}
```

