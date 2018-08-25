import * as React from "react";
import { isAuthenticated } from "./auth";
import NavBar from "./components/NeoNavBar";
import Main from "./Main";

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
        {isAuthenticated() ? <NavBar selection={this.state.selection} /> : null}
        <Main />
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
