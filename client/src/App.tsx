import * as React from "react";
import { isAuthenticated } from "./auth";
import NavBar from "./components/NeoNavBar";
import Router from "./Router";
import LoginPage from "./components/LoginPage";

class App extends React.Component<any, any> {
  public state = {
    selection: 0
  };

  constructor(props: any) {
    super(props);
  }

  public componentDidMount() {
    this.handlePathChange();
  }

  public render() {
    return (
      <div>
        {isAuthenticated() ? (
          <React.Fragment>
            <NavBar selection={this.state.selection} />
            <Router />
          </React.Fragment>
        ) : (
          <LoginPage />
        )}
      </div>
    );
  }

  private handlePathChange = () => {
    const pathname = location.pathname;

    if (pathname.indexOf("/awards") !== -1) {
      this.setState({ selection: 1 });
    }
    if (pathname.indexOf("/nominate") !== -1) {
      this.setState({ selection: 2 });
    }
  };
}

export default App;
