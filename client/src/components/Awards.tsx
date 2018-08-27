import * as React from "react";
import "./../App.css";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import createStyles from "@material-ui/core/styles/createStyles";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import withStyles, { WithStyles } from "@material-ui/core/styles/withStyles";
import CardContainer from "./CardContainer";

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

class Awards extends React.Component<IAwardsProps> {
  public state = {
    value: 0,
    awards: [
      {
        award: "All",
        nominations: [
          {
            id: 1,
            img:
              "https://myanimelist.cdn-dena.com/images/characters/3/148223.jpg",
            title: "Suzuha Amane",
            description:
              "I failed. I failed. I failed. I failed. I failed. I failed. I" +
              "failed. I failed. I failed. I failed. I failed. I failed. I" +
              "failed. I failed. I failed. I failed. I failed. I failed. I" +
              "failed. I failed. I failed. I failed."
          },
          {
            id: 2,
            img:
              "https://myanimelist.cdn-dena.com/images/characters/3/148223.jpg",
            title: "Suzuha Amane",
            description:
              "I failed. I failed. I failed. I failed. I failed. I failed. I" +
              "failed. I failed. I failed. I failed. I failed. I failed. I" +
              "failed. I failed. I failed. I failed. I failed. I failed. I" +
              "failed. I failed. I failed. I failed."
          },
          {
            id: 3,
            img:
              "https://myanimelist.cdn-dena.com/images/characters/3/148223.jpg",
            title: "Suzuha Amane",
            description:
              "I failed. I failed. I failed. I failed. I failed. I failed. I" +
              "failed. I failed. I failed. I failed. I failed. I failed. I" +
              "failed. I failed. I failed. I failed. I failed. I failed. I" +
              "failed. I failed. I failed. I failed."
          },
          {
            id: 4,
            img:
              "https://myanimelist.cdn-dena.com/images/characters/3/148223.jpg",
            title: "Suzuha Amane",
            description:
              "I failed. I failed. I failed. I failed. I failed. I failed. I" +
              "failed. I failed. I failed. I failed. I failed. I failed. I" +
              "failed. I failed. I failed. I failed. I failed. I failed. I" +
              "failed. I failed. I failed. I failed."
          },
          {
            id: 5,
            img:
              "https://myanimelist.cdn-dena.com/images/characters/3/148223.jpg",
            title: "Suzuha Amane",
            description:
              "I failed. I failed. I failed. I failed. I failed. I failed. I" +
              "failed. I failed. I failed. I failed. I failed. I failed. I" +
              "failed. I failed. I failed. I failed. I failed. I failed. I" +
              "failed. I failed. I failed. I failed."
          },
          {
            id: 6,
            img:
              "https://myanimelist.cdn-dena.com/images/characters/3/148223.jpg",
            title: "Suzuha Amane",
            description:
              "I failed. I failed. I failed. I failed. I failed. I failed. I" +
              "failed. I failed. I failed. I failed. I failed. I failed. I" +
              "failed. I failed. I failed. I failed. I failed. I failed. I" +
              "failed. I failed. I failed. I failed."
          }
        ]
      },
      {
        award: "Being Purple",
        nominations: [
          {
            id: 1,
            img:
              "https://i.pinimg.com/originals/33/f2/b2/33f2b291e7f0d3c1342823a692f9c2b3.jpg",
            title: "Anri Sonohara",
            description:
              "I love you. I love you.  I love you.  I love you.  I love you. " +
              "I love you.  I love you.  I love you.  I love you.  I love you. "
          },
          {
            id: 2,
            img:
              "https://i.pinimg.com/originals/33/f2/b2/33f2b291e7f0d3c1342823a692f9c2b3.jpg",
            title: "Anri Sonohara",
            description:
              "I love you. I love you.  I love you.  I love you.  I love you. " +
              "I love you.  I love you.  I love you.  I love you.  I love you. "
          },
          {
            id: 3,
            img:
              "https://i.pinimg.com/originals/33/f2/b2/33f2b291e7f0d3c1342823a692f9c2b3.jpg",
            title: "Anri Sonohara",
            description:
              "I love you. I love you.  I love you.  I love you.  I love you. " +
              "I love you.  I love you.  I love you.  I love you.  I love you. "
          }
        ]
      },
      {
        award: "One Small Step",
        nominations: [
          {
            id: 1,
            img:
              "https://i.pinimg.com/originals/33/f2/b2/33f2b291e7f0d3c1342823a692f9c2b3.jpg",
            title: "Anri Sonohara",
            description:
              "I love you. I love you.  I love you.  I love you.  I love you. " +
              "I love you.  I love you.  I love you.  I love you.  I love you. "
          },
          {
            id: 2,
            img:
              "https://i.pinimg.com/originals/33/f2/b2/33f2b291e7f0d3c1342823a692f9c2b3.jpg",
            title: "Anri Sonohara",
            description:
              "I love you. I love you.  I love you.  I love you.  I love you. " +
              "I love you.  I love you.  I love you.  I love you.  I love you. "
          },
          {
            id: 3,
            img:
              "https://i.pinimg.com/originals/33/f2/b2/33f2b291e7f0d3c1342823a692f9c2b3.jpg",
            title: "Anri Sonohara",
            description:
              "I love you. I love you.  I love you.  I love you.  I love you. " +
              "I love you.  I love you.  I love you.  I love you.  I love you. "
          },
          {
            id: 4,
            img:
              "https://i.pinimg.com/originals/33/f2/b2/33f2b291e7f0d3c1342823a692f9c2b3.jpg",
            title: "Anri Sonohara",
            description:
              "I love you. I love you.  I love you.  I love you.  I love you. " +
              "I love you.  I love you.  I love you.  I love you.  I love you. "
          }
        ]
      },
      {
        award: "New Horizon",
        nominations: [
          {
            id: 1,
            img:
              "https://myanimelist.cdn-dena.com/images/characters/3/148223.jpg",
            title: "Suzuha Amane",
            description:
              "I failed. I failed. I failed. I failed. I failed. I failed. I" +
              "failed. I failed. I failed. I failed. I failed. I failed. I" +
              "failed. I failed. I failed. I failed. I failed. I failed. I" +
              "failed. I failed. I failed. I failed."
          }
        ]
      },
      {
        award: "Sky High",
        nominations: [
          {
            id: 1,
            img:
              "https://i.pinimg.com/originals/33/f2/b2/33f2b291e7f0d3c1342823a692f9c2b3.jpg",
            title: "Anri Sonohara",
            description:
              "I love you. I love you.  I love you.  I love you.  I love you. " +
              "I love you.  I love you.  I love you.  I love you.  I love you. "
          },
          {
            id: 2,
            img:
              "https://i.pinimg.com/originals/33/f2/b2/33f2b291e7f0d3c1342823a692f9c2b3.jpg",
            title: "Anri Sonohara",
            description:
              "I love you. I love you.  I love you.  I love you.  I love you. " +
              "I love you.  I love you.  I love you.  I love you.  I love you. "
          }
        ]
      },
      {
        award: "Star Crew",
        nominations: [
          {
            id: 1,
            img:
              "https://myanimelist.cdn-dena.com/images/characters/3/148223.jpg",
            title: "Suzuha Amane",
            description:
              "I failed. I failed. I failed. I failed. I failed. I failed. I" +
              "failed. I failed. I failed. I failed. I failed. I failed. I" +
              "failed. I failed. I failed. I failed. I failed. I failed. I" +
              "failed. I failed. I failed. I failed."
          }
        ]
      }
    ]
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

  public render() {
    const { classes } = this.props;
    const { value, awards } = this.state;

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
            {/* <Tab label="All" />
            <Tab label="One Small Step" />
            <Tab label="New Horizon" />
            <Tab label="Sky High" />
            <Tab label="Star Crew" /> */}
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
        {/* {value === 0 && <CardContainer />}
        {value === 1 && <CardContainer />}
        {value === 2 && <CardContainer />}
        {value === 3 && <CardContainer />}
        {value === 4 && <TabContainer>Hello World</TabContainer>} */}
      </div>
    );
  }
}

export default withStyles(styles)(Awards);
