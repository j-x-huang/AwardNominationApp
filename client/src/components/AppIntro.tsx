import * as React from 'react';
import './../App.css';

export interface IAppIntro {
  user: any;
  isLoggedIn: boolean;
}

class AppIntro extends React.PureComponent<IAppIntro> {
  public render() {
    const user = this.props.user;
    const text = this.props.isLoggedIn ? `Welcome ${user.profile.name} (${user.profile.unique_name})` : 'Please login with your MYOB account to proceed';

    return(
      <p className="App-intro">{text}</p>
    );
  }
}

export default AppIntro;