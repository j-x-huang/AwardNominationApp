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
// import { getUserDetails } from "../MicrosoftGraphClient";

const styles = (theme: Theme) =>
  createStyles({
    card: {
      display: "flex",
      height: 250,
      width: 350,
      boxShadow: "none"
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
      height: 250,
      width: 158
    },
    details: {
      display: "flex",
      flexDirection: "column",
      height: 250,
      width: 192
    },
    divider: {
      backgroundColor: "#A476C1 ",
      height: 2,
      width: "25%"
    }
  });

export interface ICardProps extends WithStyles<typeof styles> {
  id: number;
  img: string;
  title: string;
  objectId: string;
  description: string;
  onSelect: (...args: any[]) => void;
}

// export interface ICardState {}

class Card extends React.Component<ICardProps> {
  public render() {
    const { classes, id, img, title, description, onSelect } = this.props;
    const handleSelect = () => onSelect(id, title);

    return (
      <div>
        <MaterialCard className={classes.card} key={id}>
          <ButtonBase className={classes.cardButton} onClick={handleSelect}>
            <CardMedia className={classes.cover} image={img} title={title} />
            <div className={classes.details}>
              <CardContent className={classes.content}>
                <Typography
                  gutterBottom={true}
                  variant="subheading"
                  component="h6"
                >
                  {title}
                </Typography>
                <Divider className={classes.divider} />
                <Typography component="p" className="cardMainContent">
                  {description}
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
