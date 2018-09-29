import * as React from "react";
import "../App.css";
import "./../css/LoginPageStyle.css";
import logo1 from "../images/logo1.png";
import { logInUser } from "./../auth";
import { Redirect } from "react-router-dom";

class LoginPage extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
  }

  public render() {
    return (
      // <div id="loginBg">
      //   <img
      //     id="loginBgPic"
      //     src="https://i.pinimg.com/originals/d5/72/81/d572813cf22c060d8dd2c4bef95bb926.jpg"
      //   />
      //   <div className="loginContainer feelix-card">
      //     <img id="loginLogo" src={logo1} alt="logo" />
      //     <p id="loginDesc">MYOB staff, come this way please.</p>
      //     <Redirect to="/home" />
      //     <button
      //       className="btn btn-primary btn-purple btn-lg"
      //       id="loginButton"
      //       onClick={logInUser}
      //     >
      //       Continue to Office 365
      //     </button>
      //   </div>
      // </div>
      <main>
        <div id="container">
          <div className="loginContainer">
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
      </main>
    );
  }
}

export default LoginPage;
