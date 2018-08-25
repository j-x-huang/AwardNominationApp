import * as React from 'react';
import './App.css';
import { getUser, isAuthenticated } from './auth';
import AppIntro from './components/AppIntro';
import LoginButton from './components/LoginButton';
import NavBar from './components/NavBar';
import logo from './logo.svg';
import { getAllUserDetails } from './MicrosoftGraphClient';

class App extends React.Component<any, any>{

  public state = {
    usersDetails: new Array<any>(),
  }

  constructor(props: any){
    super(props);
            
  }

  /**
   * Retrieves all user details when this component has mounted
   */
  public componentWillMount() {
    getAllUserDetails((err, usersDetails) => {
      if (err) {
        // handle it lol
      } else {
        this.setState({
          usersDetails
        });
      }
    });
  }

  public render() {
    const usersDetails = this.state.usersDetails;

    // This is an example of rendering the users details
    const usersDetailsBox = usersDetails.map((userDetails) => {
      return(
        // tslint:disable-next-line:jsx-key
        <div>
          {userDetails.displayName}
          {userDetails.email}
          <img src={userDetails.profilePic} />
        </div>
      );
    })
    return (
      <div className="App">  
          {(isAuthenticated()) ? <NavBar /> : null } 
            <header className="App-header">
             <img src={logo} className="App-logo" alt="logo" />
            <h1 className="App-title">Ignition Awards</h1>
          </header>
          <div className="App-user-status">
            <AppIntro isLoggedIn={isAuthenticated()} user={getUser()} />
            <LoginButton isLoggedIn={isAuthenticated()} />
          </div>
          {usersDetailsBox}
      </div>
    );
  }
}

export default App;
