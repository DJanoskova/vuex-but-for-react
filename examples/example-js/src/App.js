import { HashRouter, Switch, Route, Redirect } from 'react-router-dom';
import DemoPage from './views/DemoPage';
import PostsPage from './views/PostsPage';

function App() {
  return (
    <div className="app">
      <HashRouter>
        <Switch>
          <Route
            path="/demo"
            component={DemoPage}
            exact />
          <Route
            path="/posts"
            component={PostsPage} />
          <Redirect from="/" to="/demo" exact />
        </Switch>
      </HashRouter>
    </div>
  );
}

export default App;
