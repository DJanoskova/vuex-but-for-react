import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import { withStore } from "./contx";
import store from "./store";

const AppWithStore = withStore<{ posts: any[] | null; count: number }>(App, store);

ReactDOM.render(
  <AppWithStore />,
  document.getElementById('root')
);
