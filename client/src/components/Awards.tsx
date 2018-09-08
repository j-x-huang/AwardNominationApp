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
import MDSpinner from "react-md-spinner";

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

export interface IAwardsProps extends WithStyles<typeof styles> { }

export interface IAwardsStates {
  value: number;
  awards: any[];
  isLoading: boolean;
}

class Awards extends React.Component<IAwardsProps, IAwardsStates> {
  public state = {
    value: 0,
    awards: [] as any[],
    isLoading: true
  };

  private handleChange = (
    event: React.MouseEvent<HTMLElement>,
    value: number
  ) => {
    this.setState({ value });
  };

  private handleSelect = (id: number, name: string) => {
    alert("ID: " + id + " Name: " + name);
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

    // TODO: Remove me!!
    setTimeout(() => {
      this.setState({ isLoading: false })
    },
   15000);
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

  // private turnOff = () => {
  //   this.setState.isLoading = false;
  // };

  public render() {
    const { classes } = this.props;
    const { value, awards } = this.state;

    return (
      <div>
        {this.state.isLoading ?
          (<div id="spinner">
            <MDSpinner
              singleColor="#8241aa"
              size="50%"
            />
          </div>)
          :
          (<div className={classes.root}>
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
          </div>)
        }
      </div>
    );
  }
}

export default withStyles(styles)(Awards);
