import * as React from 'react';
import './../App.css';
import { logInUser, logOutUser } from './../auth';

export interface ILoginButtonProps {
  isLoggedIn: boolean;
}

class LoginButton extends React.PureComponent<ILoginButtonProps> {
  public render() {
    const loginFunction = this.props.isLoggedIn ? logOutUser : logInUser;
    const buttonText = this.props.isLoggedIn ? 'Logout of Ignition Awards' : 'Continue to Office365';

    return(
      <button onClick={loginFunction} className="continue-button">{buttonText}</button>
    );
  }
}

export default LoginButton;