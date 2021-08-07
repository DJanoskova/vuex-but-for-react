import React from 'react';
import { HashRouter, Switch, Route } from 'react-router-dom';

import PostsPage from "./views/PostsPage";
import PostPage from "./views/PostPage";

function App() {
  return (
    <div className="app">
      <HashRouter>
        <Switch>
          <Route
            path="/"
            component={PostsPage}
            exact />
          <Route
            path="/posts/:id"
            component={PostPage} />
        </Switch>
      </HashRouter>
    </div>
  );
}

export default App;
