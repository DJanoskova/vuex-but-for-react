import React from 'react';
import ReactDOM from 'react-dom/client';
import { withStore } from 'vuex-but-for-react';

import './index.css';

import App from './App';
import store from './store';

const AppWithStore = withStore(App, store);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<AppWithStore />);