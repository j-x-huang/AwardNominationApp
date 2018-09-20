import * as React from "react";
import "../App.css";
import logo1 from "../images/logo1.png";
import { logInUser } from "./../auth";
import { Redirect } from "react-router-dom";

class LoginPage extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
  }

  public render() {
    return (
      <div id="loginBg">
        <img
          id="loginBgPic"
          src="https://orig00.deviantart.net/e641/f/2018/043/e/7/pretty_by_edgelordxxaqua-dc2zbp6.jpg"
        />
        <div className="loginContainer feelix-card">
          <img id="loginLogo" src={logo1} alt="logo" />
          <p id="loginDesc">MYOB staff, come this way please.</p>
          <Redirect to="/home" />
          <button
            className="btn btn-primary btn-purple btn-lg"
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
