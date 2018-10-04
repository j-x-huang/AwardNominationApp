import * as React from "react";
import { isAuthenticated } from "./auth";
import NavBar from "./components/NeoNavBar";
import Router from "./Router";
import LoginPage from "./components/LoginPage";

class App extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
  }

  public render() {
    return (
      <div>
        {isAuthenticated() ? (
          <React.Fragment>
            <NavBar />
            <Router />
          </React.Fragment>
        ) : (
          <LoginPage />
        )}
      </div>
    );
  }
}

export default App;
