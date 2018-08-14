import * as React from 'react';
import { runWithAdal } from 'react-adal';
import * as ReactDOM from 'react-dom';
import App from './App';
import { authContext } from './auth';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

const DO_NOT_LOGIN = true;

runWithAdal(authContext, () => {
  ReactDOM.render(
    <App />,
    document.getElementById('root') as HTMLElement
  );
  registerServiceWorker();
}, DO_NOT_LOGIN);
  