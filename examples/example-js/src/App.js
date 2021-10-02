import { HashRouter, Switch, Route, Redirect, Link } from 'react-router-dom';

import DemoPage from './views/DemoPage';
import PostsPage from './views/PostsPage';
import ModulesPage from './views/ModulesPage';

function App() {
  return (
    <div className="app">
      <HashRouter>
        <div className="nav">
          <Link to="/demo">Demo</Link>
          <Link to="/posts">Posts</Link>
          <Link to="/modules">Modules</Link>
        </div>

        <Switch>
          <Route
            path="/demo"
            component={DemoPage}
            exact />
          <Route
            path="/posts"
            component={PostsPage} />
          <Route
            path="/modules"
            component={ModulesPage} />
          <Redirect from="/" to="/demo" exact />
        </Switch>
      </HashRouter>
    </div>
  );
}

export default App;
