import React from 'react';
import ReactDOM from 'react-dom';
import { render } from 'react-dom'
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter, HashRouter } from 'react-router-dom'

render((
  <HashRouter>
    <App />
  </HashRouter>
), document.getElementById('root'));

registerServiceWorker();
