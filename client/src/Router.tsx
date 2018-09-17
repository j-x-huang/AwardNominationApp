import * as React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import Awards from "./components/Awards";
import NominationForm from "./components/NominationForm";
import Home from "./components/Home";
import NominationComplete from "./components/NominationComplete";
import Admin from "./components/Admin";

class Router extends React.Component {
   
  public render() {

    const isAdmin = false;

    return (
      <Switch>
        <Route exact={true} path="/home" component={Home} />
        <Route path="/awards" component={Awards} />
        <Route path="/nominate" component={NominationForm} />
        <Route path="/nominationscomplete" component={NominationComplete} />
        <Route path="/mynominations" component={NominationComplete} />
        {/* TODO: Should be pulling from a variable somewhere */}
        {isAdmin ? <Route path="/admin" component={Admin} /> : <Redirect to="/home" />}
        <Route component={Home} />
      </Switch>
    );
  }
}
export default Router;
