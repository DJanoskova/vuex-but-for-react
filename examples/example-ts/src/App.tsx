import React from 'react';
import { HashRouter, Switch, Route } from 'react-router-dom';

import Posts from "./views/Posts";
import Post from "./views/Post";

function App() {
  return (
    <div className="app">
      <HashRouter>
        <Switch>
          <Route
            path="/"
            component={Posts}
            exact />
          <Route
            path="/posts/:id"
            component={Post} />
        </Switch>
      </HashRouter>
    </div>
  );
}

export default App;
