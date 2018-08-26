import * as React from "react";
import "./../App.css";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import createStyles from "@material-ui/core/styles/createStyles";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import withStyles, { WithStyles } from "@material-ui/core/styles/withStyles";
import CardContainer from "./CardContainer";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      width: "60%",
      backgroundColor: theme.palette.background.paper,
      marginLeft: "20%",
      marginRight: "20%",
      marginTop: "3%"
    }
  });

export interface IAwardsProps extends WithStyles<typeof styles> {}

/* export interface IAwardsState {
  awards: any;
} */

function TabContainer(props: any) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

class Awards extends React.Component<IAwardsProps> {
  public state = {
    value: 0,
    awards: [
      { id: 1, name: "Suzuha Amane" },
      { id: 2, name: "Suzuha Amane" },
      { id: 3, name: "Suzuha Amane" },
      { id: 4, name: "Suzuha Amane" },
      { id: 5, name: "Suzuha Amane" }
    ]
  };

  private handleChange = (
    event: React.MouseEvent<HTMLElement>,
    value: number
  ) => {
    this.setState({ value });
  };

  public render() {
    const { classes } = this.props;
    const { value } = this.state;

    return (
      <div className={classes.root}>
        <AppBar position="static" color="default">
          <Tabs
            value={value}
            onChange={this.handleChange}
            indicatorColor="primary"
            textColor="primary"
            scrollable={true}
            scrollButtons="auto"
          >
            <Tab label="Item One" />
            <Tab label="Item Two" />
            <Tab label="Item Three" />
            <Tab label="Item Four" />
            <Tab label="Item Five" />
            <Tab label="Item Six" />
          </Tabs>
        </AppBar>
        {value === 0 && <CardContainer />}
        {value === 1 && <CardContainer />}
        {value === 2 && <CardContainer />}
        {value === 3 && <CardContainer />}
        {value === 4 && <CardContainer />}
        {value === 5 && <TabContainer>Hello World</TabContainer>}
      </div>
    );
  }
}

export default withStyles(styles)(Awards);
