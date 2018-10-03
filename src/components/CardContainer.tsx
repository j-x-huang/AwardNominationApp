import * as React from "react";
import createStyles from "@material-ui/core/styles/createStyles";
import Grid from "@material-ui/core/Grid";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import withStyles, { WithStyles } from "@material-ui/core/styles/withStyles";
import Card from "./Card";

const styles = (theme: Theme) =>
  createStyles({
    grid: {
      height: "100%",
      backgroundColor: "#f9f9f9"
    },
    root: {
      flexGrow: 1,
      paddingTop: "1em",
      backgroundColor: "#f9f9f9"
    }
  });

export interface ICardContent {
  id: number;
  img: string;
  title: string;
  objectId: string;
  description: string;
  category: string;
  color: string;
}

export interface ICardContainerProps extends WithStyles<typeof styles> {
  cards: ICardContent[];
  onSelect: (...args: any[]) => void;
  category: string;
}

class CardContainer extends React.Component<ICardContainerProps> {
  public render() {
    const { classes, cards, onSelect } = this.props;

    return (
      <Grid container={true} className={classes.root} spacing={32}>
        <Grid item={true} xs={12}>
          <Grid
            container={true}
            className={classes.grid}
            justify="flex-start"
            spacing={32}
          >
            {console.log("HELLO ", this.props.cards)}
            {this.props.cards.length ? (
              cards.map((card, i) => (
                <Grid key={card.id} item={true}>
                  <Card
                    id={card.id}
                    img={card.img}
                    title={card.title}
                    description={card.description}
                    objectId={card.objectId}
                    color={card.color}
                    onSelect={onSelect}
                  />
                </Grid>
              ))
            ) : (
              <div id="noNominations">
                {" "}
                There are currently no nominations for {
                  this.props.category
                }{" "}
              </div>
            )}
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(CardContainer);
