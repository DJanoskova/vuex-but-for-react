import React from 'react';
import ReactDOM from 'react-dom';
import { withStore } from 'vuex-but-for-react';

import './index.css';

import App from './App';
import store from './store';

const AppWithStore = withStore(App, store);

ReactDOM.render(
  <AppWithStore />,
  document.getElementById('root')
);
