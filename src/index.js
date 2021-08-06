import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import withStore from './contx/withStore';
import store from './store';

const AppWithStore = withStore(App, store);

ReactDOM.render(
  <AppWithStore />,
  document.getElementById('root')
);
