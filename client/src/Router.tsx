import * as React from "react";
import { Switch, Route } from "react-router-dom";
import Awards from "./components/Awards";
import NominationForm from "./components/NominationForm";
import Home from "./components/Home";
import NominationComplete from "./components/NominationComplete";
import Admin from "./components/Admin";

class Router extends React.Component {
  public render() {
    return (
      <Switch>
        <Route exact={true} path="/home" component={Home} />
        <Route path="/awards" component={Awards} />
        <Route path="/nominate" component={NominationForm} />
        <Route path="/nominationscomplete" component={NominationComplete} />
        <Route path="/mynominations" component={NominationComplete} />
        <Route path="/admin" component={Admin} />
        <Route component={Home} />
      </Switch>
    );
  }
}
export default Router;
