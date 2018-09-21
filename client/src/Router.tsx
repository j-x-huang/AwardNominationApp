import * as React from "react";
import { Switch, Route, Redirect, RouteComponentProps } from "react-router-dom";
import Awards from "./components/Awards";
import NominationForm from "./components/NominationForm";
import Home from "./components/Home";
import NominationComplete from "./components/NominationComplete";
import Admin from "./components/Admin";
import AwardsContent from "./awards-data/AwardsContent";
import AwardCategories from "./awards-data/AwardCategories";
import AwardMyNominations from "./awards-data/AwardMyNominations";
import * as firebase from "firebase";

import { getAdminStatus } from "./MicrosoftGraphClient";

class Router extends React.Component {
  public componentDidMount() {
    this.readLockState();
    getAdminStatus((isAdmin, err) => {
      if (err) {
        // todo
      } else {
        this.setState({ isAdmin });
      }
    });
  }

  public state = {
    isAdmin: false,
    lockPath: firebase.database().ref("/lockdown"),
    isLocked: false
  };

  private readLockState = () => {
    this.state.lockPath.on("value", snap =>
      this.setState({ isLocked: snap!.val().lockState })
    );
  };

  public render() {
    const getAwardComponent = (awardsContent: AwardsContent) => (
      props: RouteComponentProps<{}>
    ) => (
      <Awards
        {...props}
        key={awardsContent.getReturnURL()}
        awardsContent={awardsContent}
      />
    );

    return (
      <Switch>
        <Route exact={true} path="/home" component={Home} />
        <Route
          path="/awards"
          render={getAwardComponent(new AwardCategories())}
        />
        {!this.state.isLocked && (
          <Route path="/nominate" component={NominationForm} />
        )}
        <Route path="/nominationscomplete" component={NominationComplete} />
        <Route
          path="/mynominations"
          render={getAwardComponent(new AwardMyNominations())}
        />
        {this.state.isAdmin && <Route path="/admin" component={Admin} />}

        {/* Default page when all the other links fail */}
        <Route component={Home} />
        <Redirect to="/home" />
      </Switch>
    );
  }
}
export default Router;
