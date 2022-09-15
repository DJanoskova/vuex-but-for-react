import { HashRouter, Routes, Route, Link } from 'react-router-dom';

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

        <Routes>
          <Route
            path="demo"
            element={<DemoPage />} />
          <Route
            path="posts"
            element={<PostsPage />} />
          <Route
            path="modules"
            element={<ModulesPage />} />
          {/*<Route path="*" element={<Navigate to="/demo" replace />}/>*/}
        </Routes>
      </HashRouter>
    </div>
  );
}

export default App;
