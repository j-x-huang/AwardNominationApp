import * as React from "react";
import { Switch, Route } from "react-router-dom";
import Awards from "./components/CardContainer";
import Nominations from "./components/NominationPage";
import Home from "./components/Home";
import NominationComplete from "./components/NominationComplete";

class Main extends React.Component {
  public render() {
    return (
      <div>
        <Switch>
          <Route exact={true} path="/" component={Home} />
          <Route path="/awards" component={Awards} />
          <Route path="/nominate" component={Nominations} />
          <Route path="/nominationscomplete" component={NominationComplete} />
        </Switch>
      </div>
    );
  }
}
export default Main;
