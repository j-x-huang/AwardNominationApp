import * as React from "react";
import Octicon, { ChevronLeft, Thumbsup } from "@githubprimer/octicons-react";
import * as firebase from "firebase";
import {
  getUsersByObjectId,
  getMyImage,
  getPhotosByObjectId
} from "../MicrosoftGraphClient";
import Comment from "./Comment";
import CommentAdder from "./CommentAdder";
import { Redirect } from "react-router-dom";
import { getUser } from "../auth";
import MDSpinner from "react-md-spinner";

export interface INominationModalProps {
  nominationID: string;
}

class NominationModal extends React.Component<any, any> {
  public state = {
    nominee: { img: "", name: "" },
    nominator: { img: "", name: "" },
    category: "",
    justification: "",
    upvoters: [] as any[],
    comments: [] as any[],
    newComment: "",
    hasBeenNominated: false,
    failed: false,
    isLoading: true,
    profilePic:
      "http://www.your-pass.co.uk/wp-content/uploads/2013/09/Facebook-no-profile-picture-icon-620x389.jpg"
  };

  public static defaultProps = {
    isModal: true
  };

  public onClose = () => {
    this.props.history.goBack();
  };

  public componentDidMount() {
    console.log("Modal mounted! Location: " + this.props.location);
    getMyImage((picUrl, err) => {
      if (err) {
        // nothing
      } else {
        const url = window.URL;
        const imageUrl = url.createObjectURL(picUrl);
        this.setState({
          profilePic: imageUrl
        });
      }
      return;
    });
    this.getNominationDetails(this.props.nominationID);
    getMyImage((picUrl, err) => {
      if (err) {
        // nothing
      } else {
        this.setState({
          profilePic: picUrl
        });
      }
      return;
    });
  }

  /* public componentWillReceiveProps() {
    console.log("console will receive props");

    this.getNominationDetails(this.props.nominationID);
    // Get the nomination info and
  } */

  public getNominationDetails(nominationID: string) {
    console.log("Function called");

    const defaultDatabase = firebase.database();
    const nomRef = defaultDatabase.ref();

    try {
      nomRef
        .child("nominations")
        .child(nominationID)
        .once("value", snapshot => {
          if (snapshot != null) {
            this.saveSnapshot(snapshot);
          }
        });
    } catch (error) {
      this.setState({ failed: true });
    }
  }

  public saveSnapshot = (snapshot: firebase.database.DataSnapshot) => {
    const data = snapshot.val();

    getUsersByObjectId([data.nominee, data.nominator], (err, users) => {
      if (err) {
        // TODO
      } else {
        let retrievedNominee = {
          img:
            "https://img.clipartxtras.com/176206ef830dd6d8b43b99daeff86f9b_facebook-profile-clipart-clipground-facebook-profile-clipart_1290-1290.jpeg",
          name: users[data.nominee].name
        };

        let retrievedNominator = {
          img:
            "https://img.clipartxtras.com/176206ef830dd6d8b43b99daeff86f9b_facebook-profile-clipart-clipground-facebook-profile-clipart_1290-1290.jpeg",
          name: users[data.nominator].name
        };

        this.setState(
          {
            justification: data.justification,
            category: data.category,
            nominee: retrievedNominee,
            nominator: retrievedNominator,
            isLoading: false
          },
          () => {
            getPhotosByObjectId(
              [data.nominee, data.nominator],
              (error, photos) => {
                if (error) {
                  // TODO
                } else {
                  retrievedNominee = {
                    img: photos[data.nominee],
                    name: this.state.nominee.name
                  };

                  retrievedNominator = {
                    img: photos[data.nominator],
                    name: this.state.nominator.name
                  };

                  this.setState({
                    nominee: retrievedNominee,
                    nominator: retrievedNominator
                  });
                }
              }
            );
          }
        );
      }
    });

    console.log(data.comments != null);
    if (data.comments != null) {
      console.log("Comments:");
      console.log(data.comments);

      const allComments = data.comments;
      const previousComments = [...this.state.comments];

      let comment;
      let key;

      for (key in allComments) {
        if (allComments.hasOwnProperty(key)) {
          comment = allComments[key];
          previousComments.push(comment);
        }
      }

      console.log(previousComments);
      this.setState({ comments: previousComments });

      const namedComments: any[] = [];
      const commentsCopy = this.state.comments;

      this.state.comments.forEach(element => {
        console.log(element.commenter);
        getUsersByObjectId([element.commenter], (err, user) => {
          if (err) {
            // TODO
          } else {
            const retrievedName = {
              img:
                "https://img.clipartxtras.com/176206ef830dd6d8b43b99daeff86f9b_facebook-profile-clipart-clipground-facebook-profile-clipart_1290-1290.jpeg",
              commenter: element.commenter,
              comment: element.comment,
              name: user[element.commenter].name
            };
            namedComments[commentsCopy.indexOf(element)] = retrievedName;
          }
          console.log(namedComments);
          this.setState({ comments: namedComments });

          const updatedComments: any[] = [];
          const anotherCommentsCopy = this.state.comments;

          this.state.comments.forEach(commentElement => {
            console.log(commentElement.commenter);
            getPhotosByObjectId([commentElement.commenter], (error, photo) => {
              if (error) {
                // TODO
              } else {
                const retrievedName = {
                  img: photo[commentElement.commenter],
                  commenter: commentElement.commenter,
                  comment: commentElement.comment,
                  name: commentElement.name
                };
                updatedComments[anotherCommentsCopy.indexOf(commentElement)] = retrievedName;
              }
              console.log(updatedComments);
              this.setState({ comments: updatedComments });
            });
          });
        });
      });
    }
    if (data.upvoters != null) {
      this.setState({
        upvoters: data.upvoters
      });

      console.log(this.state.upvoters);
      Object.keys(this.state.upvoters).forEach(key => {
        console.log(key);
        console.log(getUser().profile.oid);
        if (key === getUser().profile.oid) {
          this.setState({ hasBeenNominated: true });
        }
      });
    }
  };

  public render() {
    const {
      nominee,
      nominator,
      category,
      justification,
      comments
    } = this.state;

    return (
      <div
        className="modal award-modal"
        style={{
          display: "block",
          position: this.props.isModal ? "fixed" : "static"
        }}
        role="dialog"
        aria-labelledby="nomination"
        aria-hidden="true"
      >
        {this.state.failed ? <Redirect to="/awards" /> : null}
        <div id="award-modal-back-container">
          {this.props.isModal && (
            <button
              type="button"
              className="btn btn-light bold-this"
              onClick={this.props.onClose || this.onClose}
            >
              <div className="div-centre">
                <Octicon
                  className="back-octicon"
                  size="medium"
                  icon={ChevronLeft}
                />
                <span>Awards</span>
              </div>
            </button>
          )}
        </div>
        <div className="award-modal-dialog">
          <div className="award-modal-content">
            {/*<div className="award-modal-header" />*/}
            <div className="award-modal-body">
              <div className="nomination-info-container">
                <div className="modal-element-padding">
                  {this.state.isLoading ? (
                    <MDSpinner singleColor="#8241aa" size="200%" />
                  ) : (
                    <img className="nominee-image" src={nominee.img} />
                  )}
                  <div className="nomination-info wrap-text">
                    <h2>{nominee.name}</h2>
                    <h6>
                      Nomination: <b>{category}</b>
                    </h6>
                    <p style={{ paddingTop: "0.25em" }}>{justification}</p>
                  </div>
                </div>

                <div className="div-centre div-space-between modal-element-left-padding">
                  {this.state.isLoading ? (
                    <MDSpinner singleColor="#8241aa" size="25%" />
                  ) : (
                    <div className="nominator-info inline-components">
                      <p className="inline-components wrap-text">
                        Nominated by{" "}
                        <span className="bold-this">{nominator.name}</span>
                      </p>
                      <img
                        className="profilePic inline-components"
                        src={nominator.img}
                      />
                    </div>
                  )}
                  <button
                    type="button"
                    className="btn btn-light float-right btn-top-round inline-components"
                    onClick={this.handleUpvoteClicked}
                  >
                    <Octicon
                      className={
                        this.state.hasBeenNominated
                          ? "octiocti octism"
                          : "octigrey octism"
                      }
                      icon={Thumbsup}
                    />
                  </button>
                </div>
              </div>
              <hr />
              <p className="modal-element-padding">
                {comments.length}{" "}
                {comments.length === 1 ? "Comment" : "Comments"}
              </p>
              <CommentAdder
                comment={this.state.newComment}
                nominatorPic={this.state.profilePic}
                onCommentAdd={this.handleCommentAdd}
                onCommentChange={this.handleCommentChange}
              />
              {comments.map((
                comment,
                i // Place holder for now
              ) => (
                <Comment
                  key={i}
                  nominator={comment.name}
                  nominatorPic={comment.img}
                  comment={comment.comment}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  private handleUpvoteClicked = () => {
    this.setState({ hasBeenNominated: !this.state.hasBeenNominated });
    console.log(this.state.hasBeenNominated);
    if (!this.state.hasBeenNominated) {
      this.makeUpvote();
    } else {
      this.removeUpvote();
    }
  };

  private handleCommentAdd = () => {
    this.makeComment(this.state.newComment);
    this.setState({ newComment: "" });
  };

  private makeUpvote = () => {
    const defaultDatabase = firebase.database();

    const user = getUser();
    const uid = user.profile.oid;

    const upvoter = {
      [uid]: true
    };

    const upvoterPath = defaultDatabase.ref(
      "/nominations/" + this.props.nominationID + "/upvoters/"
    );

    return upvoterPath.update(upvoter);
  };

  private removeUpvote = () => {
    const defaultDatabase = firebase.database();

    const user = getUser();
    const uid = user.profile.oid;

    const upvoterPath = defaultDatabase.ref(
      "/nominations/" + this.props.nominationID + "/upvoters/" + uid
    );

    return upvoterPath.remove();
  };

  private makeComment = (userComment: string) => {
    const defaultDatabase = firebase.database();

    const newPostKey = defaultDatabase
      .ref()
      .child("/nominations/" + this.props.nominationID + "/comments/")
      .push().key;

    const user = getUser();

    const comment = {
      comment: userComment,
      commenter: user.profile.oid
    };
    const commentsArray = this.state.comments;
    const newComment = {
      comment: userComment,
      commenter: user.profile.oid,
      img: this.state.profilePic,
      name: user.profile.name
    }
    commentsArray.push(newComment);
    this.setState({ comments: commentsArray });
    const updates = {};
    updates[
      "/nominations/" + this.props.nominationID + "/comments/" + newPostKey
    ] = comment;
    return defaultDatabase.ref().update(updates);
  };

  private handleCommentChange = (event: any) => {
    this.setState({ newComment: event.target.value });
  };
}

export default NominationModal;
