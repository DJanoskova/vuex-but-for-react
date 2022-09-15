import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import PostsPage from "./views/PostsPage";
import PostPage from "./views/PostPage";

function App() {
  return (
    <div className="app">
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={<PostsPage />}
          />
          <Route
            path="/posts/:id"
            element={<PostPage />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
