import * as React from "react";
import { Switch, Route, Redirect, RouteComponentProps } from "react-router-dom";
import Awards from "./components/Awards";
import NominationForm from "./components/NominationForm";
import Home from "./components/Home";
import NominationComplete from "./components/NominationComplete";
import Admin from "./components/Admin";

class Router extends React.Component {
  public render() {
    const isAdmin = false;

    const getNominationComponent = (isMyNomination: boolean) => (
      props: RouteComponentProps<{}>
    ) => <Awards {...props} isMyNomination={isMyNomination} />;

    return (
      <Switch>
        <Route exact={true} path="/home" component={Home} />
        <Route path="/awards" render={getNominationComponent(false)} />
        <Route path="/nominate" component={NominationForm} />
        <Route path="/nominationscomplete" component={NominationComplete} />
        <Route path="/mynominations" render={getNominationComponent(true)} />
        {/* TODO: Should be pulling from a variable somewhere */}
        {isAdmin ? (
          <Route path="/admin" component={Admin} />
        ) : (
          <Redirect to="/home" />
        )}
        <Route component={Home} />
      </Switch>
    );
  }
}
export default Router;
