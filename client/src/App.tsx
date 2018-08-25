import * as React from "react";
import {isAuthenticated} from "./auth";
import NavBar from "./components/NavBar";
import Main from "./Main";

class App extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
  }

  public render() {
    return (
      <div>
        {isAuthenticated() ? <NavBar /> : null}
        <Main />
      </div>
    );
  }
}

export default App;
