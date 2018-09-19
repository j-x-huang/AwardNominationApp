import * as React from "react";
// import { Switch, Route, RouteComponentProps } from "react-router-dom";
import { Switch, Route, Redirect, RouteComponentProps } from "react-router-dom";
import Awards from "./components/Awards";
import NominationForm from "./components/NominationForm";
import Home from "./components/Home";
import NominationComplete from "./components/NominationComplete";
import Admin from "./components/Admin";
import AwardsContent from "./Support/AwardsContent";
import AwardCategories from "./Support/AwardCategories";
import AwardMyNominations from "./Support/AwardMyNominations";

import { getAdminStatus} from "./MicrosoftGraphClient";

class Router extends React.Component {
  
    public componentDidMount() {
      getAdminStatus((isAdmin, err) => {
        if (err) {
          // todo
        } else {
          this.setState({ isAdmin });
        }
      })
    }
  
    public state = {
      isAdmin : false
    }
  
  public render() {
    
    const isAdmin = this.state.isAdmin;

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
        <Route path="/nominate" component={NominationForm} />
        <Route path="/nominationscomplete" component={NominationComplete} />
        <Route
          path="/mynominations"
          render={getAwardComponent(new AwardMyNominations())}
        />
        {isAdmin ? (
          <Route path="/admin" component={Admin} />
        ) : (
          <Redirect to= "/home" />
        )}
        <Route component={Home} />
      </Switch>
    );
  }
}
export default Router;
