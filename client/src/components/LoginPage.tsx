import * as React from "react";
import "../App.css";
import logo1 from "../images/logo1.png";
import { logInUser } from "./../auth";

class LoginPage extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
  }

  public render() {
    return (
      <div id="loginBg">
        <img
          id="loginBgPic"
          src="https://i.pinimg.com/originals/01/e7/e2/01e7e206ff9a0b29fb4bac269140dda6.jpg"
        />
        <div id="loginPage">
          <img id="loginLogo" src={logo1} alt="logo" />
          <p id="loginDesc">MYOB staff, come this way please.</p>
          <button
            className="btn btn-primary btn-lg"
            id="loginButton"
            onClick={logInUser}
          >
            Continue to Office 365
          </button>
        </div>
      </div>
    );
  }
}

export default LoginPage;
