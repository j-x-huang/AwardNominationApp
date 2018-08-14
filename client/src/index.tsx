import * as React from 'react';
import { runWithAdal } from 'react-adal';
import * as ReactDOM from 'react-dom';
import App from './App';
import { authContext } from './auth';
import './index.css';
import registerServiceWorker from './registerServiceWorker';


runWithAdal(authContext, () => {
  ReactDOM.render(
    <App />,
    document.getElementById('root') as HTMLElement
  );
  registerServiceWorker();
}, false);
