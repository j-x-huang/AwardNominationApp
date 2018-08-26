import * as React from 'react';
import './App.css';
import { getUser, isAuthenticated } from './auth';
import AppIntro from './components/AppIntro';
import LoginButton from './components/LoginButton';
import NavBar from './components/NavBar';
import logo from './logo.svg';
import { getAllUserDetails, getMyImage } from './MicrosoftGraphClient';

class App extends React.Component<any, any>{

  public state = {
    profilePic: '',
    usersDetails: new Array<any>()
  }

  constructor(props: any){
    super(props);
            
  }

  /**
   * Retrieves all user details when this component has mounted
   */
  public componentWillMount() {

    getMyImage((pic, errr) => {
      if (errr) {
          // something
          this.setState({
            profilePic: 'http://www.your-pass.co.uk/wp-content/uploads/2013/09/Facebook-no-profile-picture-icon-620x389.jpg'
          })
      } else {
      this.setState({
        profilePic: pic
      })
    }

    getAllUserDetails((err, usersDetails) => {
      if (err) {
        // handle it lol
      } else {
        this.setState({
          usersDetails
        });
      }
    });

    })

  }

  public render() {
    const usersDetails = this.state.usersDetails;

    // This is an example of rendering the users details
    const styles = {
      border: '1px gray solid',
      maxWidth: 300,
    }
    const usersDetailsBox = usersDetails.map((userDetails) => {
      return(
        // tslint:disable-next-line:jsx-key
        <div key={userDetails.id} style={styles}>
          <p>{userDetails.name}</p>
          <p>{userDetails.email}</p>
          <img width='48px' height='auto' src={userDetails.profilePic !== '' ? userDetails.profilePic : 'http://www.your-pass.co.uk/wp-content/uploads/2013/09/Facebook-no-profile-picture-icon-620x389.jpg'} />
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
          <div>
          <img width='48px' height='auto' src={this.state.profilePic} />
          </div>
          {usersDetailsBox}
      </div>
    );
  }
}

export default App;
