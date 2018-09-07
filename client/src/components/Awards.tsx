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
    const nominations: object[] = [];

    snapshot.forEach(childSnapshot => {
      const item = childSnapshot.val();
      let nomination;

      nomination = {
        img: 'http://www.your-pass.co.uk/wp-content/uploads/2013/09/Facebook-no-profile-picture-icon-620x389.jpg',
        id: childSnapshot.key,
        description: item.justification,
        objectId: item.nominee,
        title: '',
      };

      nominations.push(nomination);
    });
    this.updateAllNominations(category, nominations);
    return nominations;
  };

  private updateAllNominations = (category: string, nominations: any[]) => {
    const awards = [...this.state.awards];

    const index = awards.findIndex(c => {
      return c.award === category;
    });

    awards[index].nominations = nominations;

    this.setState({ awards });
    /**
     * TODO: Do a batch api fetch of user details as a callback to the setState call.
     * This will retrieve all user details of nominees at once. This means we only have to update state
     * one extra time.
     * It will also mean that we don't put the responsibility of retrieving user data to the card component, meaning that
     * when we click on another category, it won't need to refetch the user details. 
     * Need to:
     *  - investigate how to make batch requests
     *  - create a MicrosoftGraphClient function to make a batch request
     *  - call the function here and parse it to create a new array of the updated details and set the state
     *  - remove code in Card which retrieves the user details
     */
  }

  public getAllNominations = () => {
    const defaultDatabase = firebase.database();
    const nomRef = defaultDatabase.ref("nominations/");
    nomRef.once("value", snapshot => {
      if (snapshot != null) {
        console.log(snapshot.toJSON());
      }
    });
  };

  // private updateNomination = (category: string, nomination: any) => {
  //   const newAwards = [...this.state.awards];

  //   const index = newAwards.findIndex(c => {
  //     return c.award === category;
  //   });

  //   console.log("Index: " + index);

  //   console.log(newAwards[index].nominations);

  //   const nominationIndex = newAwards[index].nominations.findIndex((x: any) => x.id === nomination.id);

  //   if (nominationIndex >= 0) {
  //     newAwards[index].nominations[nominationIndex] = nomination;
  //   } else {
  //     newAwards[index].nominations.push(nomination);
  //   }

  //   console.log(newAwards[index].nominations);

  //   this.setState({ awards: newAwards });
  // };

  public goBack = () => {
    this.props.history.push("/awards");
  };

  public openModal = () => {
    return (
      <div>
        <Modal
          nominationID={this.state.selectedNomination}
          onClose={this.goBack}
        />
      </div>
    );
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
          render={this.openModal}
        />
      </div>
    );
  }
}

export default withStyles(styles)(Awards);
