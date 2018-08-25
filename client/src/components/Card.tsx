import * as React from "react";
import "./../App.css";
import ButtonBase from "@material-ui/core/ButtonBase";
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
      height: 250,
      width: 350
    },
    cardButton: {
      display: "flex",
      textAlign: "initial"
    },
    content: {
      flex: "1 0 auto"
    },
    cover: {
      borderBottom: "3px solid #A476C1 ",
      height: "100%",
      width: "45%"
    },
    description: {
      color: "#687480 ",
      paddingTop: theme.spacing.unit
    },
    details: {
      display: "flex",
      flexDirection: "column",
      maxWidth: "55%"
    },
    divider: {
      backgroundColor: "#A476C1 ",
      height: "2px",
      width: "25%"
    }
  });

export interface ICardProps extends WithStyles<typeof styles> {
  /* img: string;
  title: string;
  description: string;
  link: Function; */
}

// export interface ICardState {}

class Card extends React.Component<ICardProps> {
  // state = { :  }

  public handleClick = () => {
    console.log("this is:", this);
  };

  public render() {
    const { classes } = this.props;

    return (
      <div>
        <MaterialCard className={classes.card}>
          <ButtonBase className={classes.cardButton} onClick={this.handleClick}>
            <CardMedia
              className={classes.cover}
              image="http://sf.co.ua/14/05/wallpaper-1199440.jpg"
              title=""
            />
            <div className={classes.details}>
              <CardContent
                className={classes.content}
                onClick={this.handleClick}
              >
                <Typography
                  gutterBottom={true}
                  variant="subheading"
                  component="h6"
                >
                  Suzuha Amane
                </Typography>
                <Divider className={classes.divider} />
                <Typography component="p" className={classes.description}>
                  I failed. I failed. I failed. I failed. I failed. I failed. I
                  failed. I failed. I failed. I failed. I failed. I failed. I
                  failed. I failed. I failed. I failed. I failed. I failed. I
                  failed. I failed. I failed. I failed.
                </Typography>
              </CardContent>
            </div>
          </ButtonBase>
        </MaterialCard>
      </div>
    );
  }
}

export default withStyles(styles)(Card);
