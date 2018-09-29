import * as React from "react";
import "./../App.css";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Input from "@material-ui/core/Input";
import SearchIcon from "@material-ui/icons/Search";
import createStyles from "@material-ui/core/styles/createStyles";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
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
import Measure from "react-measure";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      backgroundColor: "#f9f9f9",
      display: "block",
      marginLeft: "auto",
      marginRight: "auto",
      marginTop: "1em",
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
        color: "#8241aa",
        outline: "none"
      }
    },
    inputRoot: {
      color: "inherit",
      width: "100%"
    },
    inputInput: {
      paddingTop: theme.spacing.unit,
      paddingRight: theme.spacing.unit,
      paddingBottom: theme.spacing.unit,
      paddingLeft: theme.spacing.unit * 7,
      transition: theme.transitions.create("width"),
      fontFamily: "PT Sans",
      width: "100%",
      [theme.breakpoints.up("sm")]: {
        width: 250,
        "&:focus": {
          width: 400
        }
      }
    },
    selectEmpty: {
      marginTop: theme.spacing.unit * 2
    },
    tabSelected: {},
    select: {
      "&:hover:not(.dummy):not(.dummy):not(.dummy):before": {
        borderBottom: "2px solid #8241aa"
      },
      "&:before": {
        borderBottom: "1px solid #a476c1"
      },
      "&:after": {
        "&$focused": {
          color: "#8241aa"
        },
        borderBottom: "1px solid #a476c1"
      }
    }
  });

const StyledInputLabel = withStyles({
  shrink: {
    color: "#B9BCC0 !important"
  }
})(InputLabel);

export interface IAwardsProps extends WithStyles<typeof styles> { }

export interface IAwardsStates {
  value: number;
  selectedNomination: string;
  allAwards: any[];
  awards: any[];
  filterText: string;
  sortBy: string;
  isLoading: boolean;
  appBarWidth: number;
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
    allAwards: [] as any[],
    awards: [] as any[],
    filterText: "",
    sortBy: "",
    isLoading: true,
    appBarWidth: 160 * this.props.awardsContent.getAwardTabs().length,
    tabsWidth: 160 * this.props.awardsContent.getAwardTabs().length
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
      pathname:
        "/" + this.props.awardsContent.getReturnURL() + "/nomination/" + id,
      state: { modal: true }
    });
  };

  public componentDidMount() {
    const awardCategories = this.props.awardsContent.getAwardTabs();

    this.createAwardCategories(awardCategories);

    awardCategories.forEach((c: string) => {
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
    this.props.awardsContent.getTabNomination(str, this.retrieveUserDetails);
  }

  public retrieveUserDetails = (snapshot: any[], category: string) => {
    const nominations: object[] = [];
    const nominees: string[] = [];

    if (snapshot.length <= 0) {
      this.setState({ isLoading: false });
    } else {
      snapshot.forEach(childSnapshot => {
        let item: any;
        try {
          item = childSnapshot.val();
        } catch (err) {
          item = childSnapshot;
        }

        console.log("Nomination details:");
        console.log(category);
        console.log(item);
        if (nominees.indexOf(item.nominee) === -1) {
          nominees.push(item.nominee);
        }
      });

      getUsersByObjectId(nominees, (err, users) => {
        if (err) {
          // todo
        } else {
          snapshot.forEach(childSnapshot => {
            let item: any;
            try {
              item = childSnapshot.val();
            } catch (err) {
              item = childSnapshot;
            }
            const name =
              users[item.nominee] === undefined ? "" : users[item.nominee].name;
            let nomination;

            nomination = {
              img:
                "http://www.your-pass.co.uk/wp-content/uploads/2013/09/Facebook-no-profile-picture-icon-620x389.jpg",
              id: item.key,
              description: item.justification,
              objectId: item.nominee,
              title: name
            };
            nominations.push(nomination);
          });
          console.log(nominations);
          this.updateAllNominations(category, nominations, nominees);
        }
      });
    }

    return nominations;
  };

  private updateAllNominations = (
    category: string,
    nominations: any[],
    nominees: any[]
  ) => {
    console.log("updateAllNominations called, tab: " + category);
    const awards = [...this.state.awards];

    const index = awards.findIndex(c => {
      return c.award === category;
    });

    awards[index].nominations = nominations;

    this.setState({ awards, isLoading: false, allAwards: awards }, () => {
      // fetch all images for the nominees and reupdate the state
      getPhotosByObjectId(nominees, (err, photos) => {
        if (err) {
          // todo
        } else {
          const newAwards = [...this.state.allAwards];
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
          console.log(newAwards);
          this.setState({ awards: newAwards, allAwards: newAwards }, () => {
            // this ensures that the loading of pictures doesn't affect the filtering and sorting
            this.sortNominationsByName(this.state.sortBy);
          });
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

  public openModal = () => {
    return (
      <div>
        <Modal nominationID={this.state.selectedNomination} />
      </div>
    );
  };

  private handleSearch = (event: any) => {
    this.filterNominationsByName(event.target.value);
  };

  private handleSort = (event: any) => {
    this.setState({ sortBy: event.target.value });
    this.sortNominationsByName(event.target.value);
  };

  private sortNominationsByName(nameType: string) {
    if (nameType === "Firstname" || nameType === "Lastname") {
      const awards = this.state.allAwards;
      const sortedAwards = new Array<any>();

      awards.forEach(awardCategory => {
        const newAwardCategory = {
          award: awardCategory.award,
          nominations: []
        };
        let newNominations;
        if (nameType === "Firstname") {
          newNominations = awardCategory.nominations.sort((a: any, b: any) => {
            return a.title.toLowerCase() > b.title.toLowerCase()
              ? 1
              : b.title.toLowerCase() > a.title.toLowerCase()
                ? -1
                : 0;
          });
        } else if (nameType === "Lastname") {
          newNominations = awardCategory.nominations.sort((a: any, b: any) => {
            const aName = a.title.split(" ");
            const aLast = aName[aName.length - 1];

            const bName = b.title.split(" ");
            const bLast = bName[bName.length - 1];

            return aLast.toLowerCase() > bLast.toLowerCase()
              ? 1
              : bLast.toLowerCase() > aLast.toLowerCase()
                ? -1
                : 0;
          });
        }

        newAwardCategory.nominations = newNominations;
        sortedAwards.push(newAwardCategory);
      });
      console.log(sortedAwards);
      this.setState({ allAwards: sortedAwards, awards: sortedAwards }, () => {
        this.filterNominationsByName(this.state.filterText);
      });
    } else {
      // ensures filtering is still applied even if no sorting option is selected
      this.filterNominationsByName(this.state.filterText);
    }
  }

  private filterNominationsByName = (name: string) => {
    const awards = this.state.allAwards;

    const filteredAwards = new Array<any>();

    // applies filtering to every award category
    awards.forEach(awardCategory => {
      const newAwardCategory = {
        award: awardCategory.award,
        nominations: []
      };

      // checks whether or not the nomination contains the filtering text string
      const newNominations = awardCategory.nominations.filter(
        (nomination: any) => {
          return nomination.title.toLowerCase().includes(name.toLowerCase());
        }
      );

      newAwardCategory.nominations = newNominations;
      filteredAwards.push(newAwardCategory);
    });

    this.setState({ awards: filteredAwards, filterText: name });
  };

  // Prevents the use of the 'enter' key
  // Similar handling done in handleEnterKeyPress from CommentAdder component
  private preventEnter = (event: any) => {
    if (event.keyCode === 13 || event.charCode === 13) {
      event.preventDefault();
    }
  };

  public render() {
    const { classes } = this.props;
    const { value, awards, appBarWidth, tabsWidth } = this.state;
    const updateAppBarWidth = () => (contentRect: any) =>
      this.setState({ appBarWidth: contentRect.bounds.width });

    return (
      <div>
        {this.state.isLoading ? (
          <div id="spinner">
            <MDSpinner singleColor="#8241aa" size="50%" />
          </div>
        ) : (
          <div className={classes.root} id="awardsContainer">
            <Measure bounds={true} onResize={updateAppBarWidth()}>
              {({ measureRef }: any) => (
                <div ref={measureRef}>
                  <AppBar
                    position="static"
                    color="default"
                    className={classes.tabBar}
                  >
                    <Tabs
                      value={value}
                      onChange={this.handleChange}
                      // centered={true}
                      classes={{ indicator: classes.tabsIndicator }}
                      // scrollable={true}
                      // scrollButtons="auto"
                      centered={appBarWidth >= tabsWidth}
                      scrollable={appBarWidth < tabsWidth}
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
                </div>
              )}
            </Measure>
            <form
              autoComplete="off"
              id="filterBar"
              onKeyPress={this.preventEnter}
            >
              <FormControl className="formControl">
                <div className="grow" />
                <div className="searchBar">
                  <div className="searchIcon">
                    <SearchIcon />
                  </div>
                  <Input
                    placeholder="Search…"
                    disableUnderline={true}
                    onChange={this.handleSearch}
                    classes={{
                      root: classes.inputRoot,
                      input: classes.inputInput
                    }}
                  />
                </div>
              </FormControl>
              <FormControl className="formControl" style={{ float: "right" }}>
                <StyledInputLabel
                  style={{ fontFamily: "PT Sans" }}
                  className={classes.select}
                >
                  Sort By
                </StyledInputLabel>
                <Select
                  className={classes.select}
                  value={this.state.sortBy}
                  onChange={this.handleSort}
                  inputProps={{ name: "sortBy" }}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value="Firstname">First Name</MenuItem>
                  <MenuItem value="Lastname">Last Name</MenuItem>
                </Select>
              </FormControl>
            </form>
            {awards.map(
              (award, i) =>
                value === i && (
                  <CardContainer
                    key={i}
                    cards={award.nominations}
                    onSelect={this.handleSelect}
                    category={award.award}
                  />
                )
            )}
            <Route
              path={
                "/" +
                this.props.awardsContent.getReturnURL() +
                "/nomination/" +
                this.state.selectedNomination
              }
              render={this.openModal}
            />
          </div>
        )}
      </div>
    );
  }
}

export default withStyles(styles)(Awards);
