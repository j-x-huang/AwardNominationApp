import * as React from "react";
import { Switch, Route } from "react-router-dom";
import Awards from "./components/Awards";
import NominationForm from "./components/NominationForm";
import Home from "./components/Home";
import NominationComplete from "./components/NominationComplete";

class Router extends React.Component {
  public render() {
    return (
      <div>
        <Switch>
          <Route exact={true} path="/" component={Home} />
          <Route path="/awards" component={Awards} />
          <Route path="/nominate" component={NominationForm} />
          <Route path="/nominationscomplete" component={NominationComplete} />
        </Switch>
      </div>
    );
  }
}
export default Router;
