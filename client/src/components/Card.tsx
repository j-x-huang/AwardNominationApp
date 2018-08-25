import * as React from "react";
import "./../App.css";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import createStyles from "@material-ui/core/styles/createStyles";
import Divider from "@material-ui/core/Divider";
import MaterialCard from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import withStyles, { WithStyles } from "@material-ui/core/styles/withStyles";

const styles = (theme: Theme) =>
  createStyles({
    card: {
      display: "flex",
      height: 275,
      width: 450
    },
    content: {
      flex: "1 0 auto"
    },
    cover: {
      width: 210
    },
    details: {
      display: "flex",
      flexDirection: "column",
      maxWidth: 240
    }
  });

export interface ICardProps extends WithStyles<typeof styles> {
  img: string;
  title: string;
  description: string;
  link: Function;
}

/* const styles = ({ palette, spacing }: Theme) =>
  createStyles({
    root: {
      display: "flex",
      flexDirection: "column",
      padding: spacing.unit,
      backgroundColor: palette.background.default,
      color: palette.primary.main
    }
  });

const styles = theme => ({
  card: {
    display: "flex",
    width: 450,
    height: 275
  },
  details: {
    display: "flex",
    flexDirection: "column",
    maxWidth: 240
  },
  content: {
    flex: "1 0 auto"
  },
  cover: {
    width: 210
  }
}); */

// export interface ICardState {}

class Card extends React.Component<ICardProps> {
  // state = { :  }
  public render() {
    return (
      <div>
        <MaterialCard className={this.props.classes.card}>
          <CardMedia
            className={this.props.classes.cover}
            image="https://myanimelist.cdn-dena.com/images/characters/3/148223.jpg"
            title="Live from space album cover"
          />
          <div className={this.props.classes.details}>
            <CardContent className={this.props.classes.content}>
              <Typography gutterBottom={true} variant="headline" component="h4">
                Suzuha Amane
              </Typography>
              <Divider />
              <Typography component="p">
                I failed. I failed. I failed. I failed. I failed. I failed. I
                failed. I failed. I failed. I failed. I failed. I failed. I
                failed. I failed. I failed. I failed. I failed. I failed. I
                failed. I failed. I failed. I failed.
              </Typography>
            </CardContent>
          </div>
        </MaterialCard>
      </div>
    );
  }
}

export default withStyles(styles)(Card);
