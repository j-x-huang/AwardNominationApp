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
import {
  getPhotosByObjectId,
  getUsersByObjectId
} from "../MicrosoftGraphClient";
import MDSpinner from "react-md-spinner";

function awardsContainerWidth() {
  const width = window.screen.availWidth;
  if (width < 732) {
    return 350;
  } else if (width < 1114) {
    return 732;
  } else if (width < 1496) {
    return 1114;
  }
  return 1496;
}

const styles = (theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      backgroundColor: theme.palette.background.paper,
      display: "block",
      width: awardsContainerWidth(),
      marginLeft: "auto",
      marginRight: "auto",
      marginTop: "2%",
      padding: 0
    },
    tabBar: {
      boxShadow: "none",
      backgroundColor: "#f9f9f9"
    },
    tabsIndicator: {
      backgroundColor: "#8241aa"
    },
    tabRoot: {
      fontWeight: theme.typography.fontWeightRegular,
      borderColor: "black",
      "&:hover": {
        color: "#8241aa",
        opacity: 1
      },
      "&$tabSelected": {
        fontWeight: theme.typography.fontWeightMedium
      },
      "&:focus": {
        color: "#8241aa"
      }
    },
    tabSelected: {}
  });

export interface IAwardsProps extends WithStyles<typeof styles> {}

export interface IAwardsStates {
  value: number;
  selectedNomination: string;
  awards: any[];
  isLoading: boolean;
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
    awards: [] as any[],
    isLoading: true
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
            console.log(this.retrieveUserDetails(snapshot, str));
          }
        });
    } else {
      nomRef
        .child("nominations")
        .orderByChild("category")
        .equalTo(str)
        .once("value", snapshot => {
          if (snapshot != null) {
            console.log(this.retrieveUserDetails(snapshot, str));
          }
        });
    }
  }

  public retrieveUserDetails = (
    snapshot: firebase.database.DataSnapshot,
    category: string
  ) => {
    const nominations: object[] = [];
    const nominees: string[] = [];

    snapshot.forEach(childSnapshot => {
      const item = childSnapshot.val();

      if (nominees.indexOf(item.nominee) === -1) {
        nominees.push(item.nominee);
      }
    });

    getUsersByObjectId(nominees, (err, users) => {
      if (err) {
        // todo
      } else {
        snapshot.forEach(childSnapshot => {
          const item = childSnapshot.val();
          const name =
            users[item.nominee] === undefined ? "" : users[item.nominee].name;
          let nomination;

          nomination = {
            img:
              "http://www.your-pass.co.uk/wp-content/uploads/2013/09/Facebook-no-profile-picture-icon-620x389.jpg",
            id: childSnapshot.key,
            description: item.justification,
            objectId: item.nominee,
            title: name
          };
          nominations.push(nomination);
        });

        this.updateAllNominations(category, nominations, nominees);
      }
    });
    return nominations;
  };

  private updateAllNominations = (
    category: string,
    nominations: any[],
    nominees: any[]
  ) => {
    const awards = [...this.state.awards];

    const index = awards.findIndex(c => {
      return c.award === category;
    });

    awards[index].nominations = nominations;

    this.setState({ awards, isLoading: false }, () => {
      // fetch all images for the nominees and reupdate the state
      getPhotosByObjectId(nominees, (err, photos) => {
        if (err) {
          // todo
        } else {
          const newAwards = [...this.state.awards];

          const categoryIndex = awards.findIndex(c => {
            return c.award === category;
          });

          const categoryNominations = awards[categoryIndex].nominations;
          const nominationsWithPhoto = new Array<any>();

          categoryNominations.forEach((nomination: any) => {
            nomination.img = photos[nomination.objectId];
            nominationsWithPhoto.push(nomination);
          });

          newAwards[categoryIndex].nominations = nominationsWithPhoto;
          this.setState({ awards: newAwards });
        }
      });
    });
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
      <div>
        {this.state.isLoading ? (
          <div id="spinner">
            <MDSpinner singleColor="#8241aa" size="50%" />
          </div>
        ) : (
          <div className={classes.root}>
            <AppBar
              position="static"
              color="default"
              className={classes.tabBar}
            >
              <Tabs
                value={value}
                onChange={this.handleChange}
                centered={true}
                classes={{
                  indicator: classes.tabsIndicator
                }}
              >
                {awards.map((award, i) => (
                  <Tab
                    key={i}
                    label={award.award}
                    classes={{
                      root: classes.tabRoot,
                      selected: classes.tabSelected
                    }}
                  />
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
        )}
      </div>
    );
  }
}

export default withStyles(styles)(Awards);
