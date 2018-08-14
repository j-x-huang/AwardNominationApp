import * as React from 'react';
import './App.css';
import { getUser, logOutUser } from './auth';
import logo from './logo.svg';



class App extends React.Component {
  public render() {
    const user = getUser();
    // tslint:disable-next-line:no-console
    console.log(user);
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.tsx</code> and save to reload.
        </p>
        <p>        
          Welcome {user.userName}
        </p>

        <button onClick={logOutUser}>Sign out</button>
      </div>
    );
  }
}

export default App;
