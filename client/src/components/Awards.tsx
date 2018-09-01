import * as React from "react";
import "./../App.css";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import createStyles from "@material-ui/core/styles/createStyles";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import withStyles, { WithStyles } from "@material-ui/core/styles/withStyles";
import CardContainer from "./CardContainer";
import * as firebase from "firebase";
import { getUserDetails } from "../MicrosoftGraphClient";
import { Route } from "react-router-dom";
import Modal from "./NominationModal";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      width: "90%",
      backgroundColor: theme.palette.background.paper,
      marginLeft: "5%",
      marginRight: "5%",
      marginTop: "2%"
    },
    tabBar: {
      boxShadow: "none",
      backgroundColor: "#f9f9f9"
    }
  });

export interface IAwardsProps extends WithStyles<typeof styles> {}

export interface IAwardsStates {
  value: number;
  selectedNomination: string;
  awards: any[];
}

class Awards extends React.Component<any, IAwardsStates> {
  public previousLocation = this.props.location;

  public componentWillUpdate(nextProps: any) {
    const { location } = this.props;
    if (
      nextProps.history.action !== "POP" &&
      (!location.state || !location.state.modal)
    ) {
      this.previousLocation = this.props.location;
    }
  }

  public state = {
    value: 0,
    selectedNomination: "",
    awards: [] as any[]
  };

  private handleChange = (
    event: React.MouseEvent<HTMLElement>,
    value: number
  ) => {
    this.setState({ value });
  };

  private handleSelect = (id: string, name: string) => {
    this.setState({ selectedNomination: id });
    this.props.history.push({
      pathname: "/awards/nomination/" + id,
      state: { modal: true }
    });
  };

  public componentDidMount() {
    const awardCategories = [
      "All",
      "Being Purple",
      "One Small Step",
      "New Horizon",
      "Sky High",
      "Star Crew"
    ];

    this.createAwardCategories(awardCategories);

    awardCategories.forEach(c => {
      this.getCategoryNomination(c);
    });
  }

  public createAwardCategories = (categories: string[]) => {
    const newAwards = [...this.state.awards];

    let category;

    categories.forEach(c => {
      category = { award: c, nominations: [] as any[] };
      newAwards.push(category);
    });

    this.setState({ awards: newAwards });
  };

  public getCategoryNomination(str: string) {
    const defaultDatabase = firebase.database();
    const nomRef = defaultDatabase.ref();

    if (str === "All") {
      nomRef
        .child("nominations")
        .orderByChild("category")
        .once("value", snapshot => {
          if (snapshot != null) {
            console.log(this.snapshotToArray(snapshot, str));
          }
        });
    } else {
      nomRef
        .child("nominations")
        .orderByChild("category")
        .equalTo(str)
        .once("value", snapshot => {
          if (snapshot != null) {
            console.log(this.snapshotToArray(snapshot, str));
          }
        });
    }
  }

  public snapshotToArray = (
    snapshot: firebase.database.DataSnapshot,
    category: string
  ) => {
    const returnArr: object[] = [];

    snapshot.forEach(childSnapshot => {
      const item = childSnapshot.val();
      let userName: string;
      let imgUrl: string;
      let ret;
      getUserDetails(item.nominee, (err, userDetails) => {
        if (err) {
          // TODO
        } else {
          userName = userDetails.name;
          imgUrl = userDetails.profilePic;
          ret = {
            img: imgUrl,
            id: childSnapshot.key,
            description: item.justification,
            title: userName
          };
          this.updateNomination(category, ret);
          returnArr.push(ret);
        }
      });
      console.log("Array: " + returnArr);
    });
    return returnArr;
  };

  public getAllNominations = () => {
    const defaultDatabase = firebase.database();
    const nomRef = defaultDatabase.ref("nominations/");
    nomRef.once("value", snapshot => {
      if (snapshot != null) {
        console.log(snapshot.toJSON());
      }
    });
  };

  private updateNomination = (category: string, nomination: any) => {
    const newAwards = [...this.state.awards];

    const index = newAwards.findIndex(c => {
      return c.award === category;
    });

    console.log("Index: " + index);

    console.log(newAwards[index].nominations);

    newAwards[index].nominations.push(nomination);

    console.log(newAwards[index].nominations);

    this.setState({ awards: newAwards });
  };

  public render() {
    const { classes } = this.props;
    const { value, awards } = this.state;
    // const { location } = this.props;

    /* const isModal = !!(
      location.state &&
      location.state.modal &&
      this.previousLocation !== location
    ); */

    return (
      <div className={classes.root}>
        <AppBar position="static" color="default" className={classes.tabBar}>
          <Tabs
            value={value}
            onChange={this.handleChange}
            indicatorColor="primary"
            textColor="primary"
            centered={true}
          >
            {awards.map((award, i) => (
              <Tab key={i} label={award.award} />
            ))}
          </Tabs>
        </AppBar>
        {awards.map(
          (award, i) =>
            value === i && (
              <CardContainer
                key={i}
                cards={award.nominations}
                onSelect={this.handleSelect}
              />
            )
        )}
        <Route
          path={"/awards/nomination/" + this.state.selectedNomination}
          render={() => (
            <div>
              <Modal
                nominationID={this.state.selectedNomination}
                onClose={() => this.props.history.push("/awards")}
              />
            </div>
          )}
        />
      </div>
    );
  }
}

export default withStyles(styles)(Awards);
