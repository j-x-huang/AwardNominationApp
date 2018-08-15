import * as React from 'react';
import './App.css';
import { getUser, isAuthenticated, logInUser, logOutUser } from './auth';
import logo from './logo.svg';
import NavBar from './NavBar';


class App extends React.Component<any, any>{

  constructor(props: any){
    super(props);
            
  }

  public render() {
    let button;
    let appIntro;
    const user = getUser();
    if(isAuthenticated && user!=null){
      // tslint:disable-next-line:no-console
      console.log(user);
      button = <button onClick={logOutUser} className="continue-button">Log Out of Ignition Awards</button>;
      appIntro = <p className="App-intro">Welcome {user.profile.name} ({user.profile.unique_name})</p>
    }else {
      button = <button onClick={logInUser} className="continue-button">Continue to Office 365 </button>
      appIntro = <p className="App-intro">Please login with your MYOB account to proceed</p>
    }
    return (
      <div className="App">  
          {(isAuthenticated && user!=null) ? <NavBar /> : null } 
            <header className="App-header">
             <img src={logo} className="App-logo" alt="logo" />
            <h1 className="App-title">Ignition Awards</h1>
          </header>
          <div className="App-user-status">
            {appIntro}
            {button}
          </div>
      </div>
    );
  }
}

export default App;
