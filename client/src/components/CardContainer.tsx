import * as React from "react";
import createStyles from "@material-ui/core/styles/createStyles";
import Grid from "@material-ui/core/Grid";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import withStyles, { WithStyles } from "@material-ui/core/styles/withStyles";
import Card from "./Card";

const styles = (theme: Theme) =>
  createStyles({
    demo: {
      height: 240
    },
    root: {
      flexGrow: 1
    }
  });

export interface ICardContainerProps extends WithStyles<typeof styles> {}

export interface ICardContainerState {
  cards: any;
}

class CardContainer extends React.Component<
  ICardContainerProps,
  ICardContainerState
> {
  public state = {
    cards: [
      { id: 1 },
      { id: 2 },
      { id: 3 },
      { id: 4 },
      { id: 5 },
      { id: 6 },
      { id: 7 },
      { id: 8 },
      { id: 9 }
    ]
  };

  public render() {
    const { classes } = this.props;

    return (
      <Grid
        container={true}
        className={classes.root}
        spacing={16}
        // alignItems="flex-start"
        // justify="flex-start"
      >
        <Grid item={true} xs={12}>
          <Grid
            container={true}
            className={classes.demo}
            justify="flex-start"
            spacing={16}
          >
            {this.state.cards.map(card => (
              <Grid key={card.id} item={true}>
                <Card />
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(CardContainer);
