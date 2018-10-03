import * as React from "react";
import "./../css/ModalStyle.css";
import defaultProfilePic from "../images/default-profile-pic.jpg";
import defaultProfilePicComments from "../images/default-profile-pic-comments.jpg";
import Octicon, { ChevronLeft } from "@githubprimer/octicons-react";
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
import { withRouter } from "react-router-dom";

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
    commenters: [] as any[],
    newComment: "",
    hasBeenNominated: false,
    failed: false,
    isLoading: true,
    isLocked: false,
    profilePic: defaultProfilePic,
    lockPath: firebase.database().ref("/lockdown"),
    nominationID: this.props.nominationID
  };

  public static defaultProps = {
    isModal: true
  };

  public onClose = () => {
    this.props.history.goBack();
  };

  public componentDidMount() {
    this.readLockState();

    if (
      this.state.nominationID === "" ||
      this.state.nominationID === undefined
    ) {
      const pathname = this.props.location.pathname;
      const index = pathname.lastIndexOf("/");
      const currentNominationID = pathname.substring(index + 1);
      console.log(currentNominationID);

      this.setState(
        {
          nominationID: currentNominationID
        },
        this.initModal
      );
    } else {
      this.initModal();
    }
  }

  private initModal = () => {
    this.getNominationDetails(this.state.nominationID);
    // Image for the current user
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
  };

  public getNominationDetails(nominationID: string) {
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

  private readLockState = () => {
    this.state.lockPath.on("value", snap =>
      this.setState({ isLocked: snap!.val().lockState })
    );
  };

  public saveSnapshot = (snapshot: firebase.database.DataSnapshot) => {
    const data = snapshot.val();

    getUsersByObjectId([data.nominee, data.nominator], (err, users) => {
      if (err) {
        // TODO
      } else {
        let retrievedNominee = {
          img: defaultProfilePicComments,
          name: users[data.nominee].name
        };

        let retrievedNominator = {
          img: defaultProfilePicComments,
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
      const commentersArray: any[] = [];

      let comment;
      let key;
      let commenter;

      for (key in allComments) {
        if (allComments.hasOwnProperty(key)) {
          comment = allComments[key];
          previousComments.push(comment);
          commenter = comment.commenter;
          commentersArray.push(commenter);

          if (commentersArray.indexOf(commenter) === -1) {
            commentersArray.push(commenter);
          }
        }
      }

      console.log(previousComments);
      this.setState({
        comments: previousComments,
        commenters: commentersArray
      });

      const namedComments: any[] = [];
      const commenters = this.state.commenters;
      const comments = this.state.comments;

      getUsersByObjectId(commenters, (err, users) => {
        if (err) {
          console.log("error");
          // todo
        } else {
          comments.forEach(commentInfo => {
            console.log(commentInfo.commenter);
            const fullname =
              users[commentInfo.commenter] === undefined
                ? ""
                : users[commentInfo.commenter].name;
            console.log(name);
            let comment1;

            comment1 = {
              img: defaultProfilePic,
              commenter: commentInfo.commenter,
              comment: commentInfo.comment,
              name: fullname
            };
            namedComments.push(comment1);
          });
          this.setState({ comments: namedComments });

          const updatedComments: any[] = [];
          const newComments = this.state.comments;

          getPhotosByObjectId(commenters, (err2, photos) => {
            if (err) {
              console.log("error");
              // todo
            } else {
              newComments.forEach(commentInfo => {
                console.log(commentInfo.commenter);
                const picture =
                  photos[commentInfo.commenter] === undefined
                    ? ""
                    : photos[commentInfo.commenter];
                console.log(picture);
                let comment1;

                comment1 = {
                  img: picture,
                  commenter: commentInfo.commenter,
                  comment: commentInfo.comment,
                  name: commentInfo.name
                };
                updatedComments.push(comment1);
              });
              this.setState({ comments: updatedComments });
            }
          });
        }
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

    console.log("State ID:");
    console.log(this.state.nominationID);

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
              onClick={this.onClose}
            >
              <div className="div-centre">
                <Octicon
                  className="back-octicon"
                  size="medium"
                  icon={ChevronLeft}
                />
                <span>Back</span>
              </div>
            </button>
          )}
        </div>
        <div className="award-modal-dialog">
          <div className="award-modal-content">
            {/*<div className="award-modal-header" />*/}

            {this.state.isLoading ? (
              <div className="div-spin-centre">
                <MDSpinner singleColor="#8241aa" size="200%" />
              </div>
            ) : (
              <div className="award-modal-body">
                <div className="nomination-info-container">
                  <div className="modal-element-padding">
                    <img className="nominee-image" src={nominee.img} />
                    <div className="nomination-info wrap-text">
                      <h2>{nominee.name}</h2>
                      <h6>
                        Category: <b>{category}</b>
                      </h6>
                      <p style={{ paddingTop: "0.25em" }}>{justification}</p>
                    </div>
                  </div>

                  <div className="div-centre div-space-between modal-element-left-padding">
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
                    <button
                      type="button"
                      className="btn btn-light float-right btn-top-round inline-components"
                      onClick={this.handleUpvoteClicked}
                      style={this.state.isLocked ? { display: "none" } : {}}
                    >
                      <i
                        className={
                          this.state.hasBeenNominated
                            ? "material-icons octiocti octism"
                            : "material-icons octigrey octism"
                        }
                      >
                        thumb_up_alt
                      </i>
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
            )}
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
    if (this.state.newComment.trim() !== "") {
      this.makeComment(this.state.newComment);
      this.setState({ newComment: "" });

      // scroll to the end of the modal
      const awardModal = document.getElementsByClassName("award-modal")[0];
      awardModal.scrollTo({
        top: awardModal.scrollHeight,
        behavior: "smooth"
      });
    }
  };

  private makeUpvote = () => {
    const defaultDatabase = firebase.database();

    const user = getUser();
    const uid = user.profile.oid;

    const upvoter = {
      [uid]: true
    };

    const upvoterPath = defaultDatabase.ref(
      "/nominations/" + this.state.nominationID + "/upvoters/"
    );

    const nominatorPath = defaultDatabase.ref("nominators/" + uid);
    const nomination = {
      [this.state.nominationID]: true
    };

    nominatorPath.update(nomination);

    return upvoterPath.update(upvoter);
  };

  private removeUpvote = () => {
    const defaultDatabase = firebase.database();

    const user = getUser();
    const uid = user.profile.oid;

    const upvoterPath = defaultDatabase.ref(
      "/nominations/" + this.state.nominationID + "/upvoters/" + uid
    );

    const nominatorPath = defaultDatabase.ref(
      "nominators/" + uid + "/" + this.state.nominationID
    );
    nominatorPath.remove();

    return upvoterPath.remove();
  };

  private makeComment = (userComment: string) => {
    const defaultDatabase = firebase.database();

    const newPostKey = defaultDatabase
      .ref()
      .child("/nominations/" + this.state.nominationID + "/comments/")
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
    };
    commentsArray.push(newComment);
    this.setState({ comments: commentsArray });
    const updates = {};
    updates[
      "/nominations/" + this.state.nominationID + "/comments/" + newPostKey
    ] = comment;
    return defaultDatabase.ref().update(updates);
  };

  private handleCommentChange = (event: any) => {
    this.setState({ newComment: event.target.value });
  };
}

export default withRouter(NominationModal);
