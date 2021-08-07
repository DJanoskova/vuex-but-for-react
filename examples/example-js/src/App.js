import { HashRouter, Switch, Route } from 'react-router-dom';

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
