import * as React from "react";
import "../App.css";
import { getUser, isAuthenticated } from "../auth";
import AppIntro from "./AppIntro";
import LoginButton from "./LoginButton";
import logo from "../logo.svg";

class Home extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
  }

  public render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Ignition Awards</h1>
        </header>
        <div className="App-user-status">
          <AppIntro isLoggedIn={isAuthenticated()} user={getUser()} />
          <LoginButton isLoggedIn={isAuthenticated()} />
        </div>
      </div>
    );
  }
}

export default Home;
