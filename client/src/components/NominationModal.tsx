import * as React from "react";
import Octicon, { ChevronLeft, Thumbsup } from "@githubprimer/octicons-react";
import * as firebase from "firebase";
import { getUserDetails } from "../MicrosoftGraphClient";
import Comment from "./Comment";
import CommentAdder from "./CommentAdder";
import { Redirect } from "react-router-dom";
import { getUser } from "../auth";

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
    failed: false
  };

  public static defaultProps = {
    isModal: true
  };

  public onClose = () => {
    this.props.history.goBack();
  };

  public componentDidMount() {
    console.log("Modal mounted! Location: " + this.props.location);
    this.getNominationDetails(this.props.nominationID);
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
      this.setState({ failed: true })
    }

  }

  public saveSnapshot = (snapshot: firebase.database.DataSnapshot) => {
    const data = snapshot.val();
    this.setState({
      justification: data.justification,
      category: data.category
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
    }
    if (data.upvoters != null) {
      this.setState({
        upvoters: data.upvoters
      });
    }
    getUserDetails(data.nominee, (err, userDetails) => {
      if (err) {
        // TODO
      } else {
        const retrievedNominee = {
          img: userDetails.profilePic,
          name: userDetails.name
        };

        this.setState({
          nominee: retrievedNominee
        });
      }
    });
    getUserDetails(data.nominator, (err, userDetails) => {
      if (err) {
        // TODO
      } else {
        const retrievedNominator = {
          img: userDetails.profilePic,
          name: userDetails.name
        };

        this.setState({
          nominator: retrievedNominator
        });
      }
    });
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
                  <img className="nominee-image" src={nominee.img} />
                  <div className="nomination-info wrap-text">
                    <h2>{nominee.name}</h2>
                    <h6>
                      Nomination: <b>{category}</b>
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
                {comments.length} Comments
              </p>
              <CommentAdder
                comment={this.state.newComment}
                nominatorPic="https://galvanicmedia.files.wordpress.com/2018/02/screen-shot-2018-02-03-at-3-38-38-pm.png?w=672&h=372&crop=1"
                onCommentAdd={this.handleCommentAdd}
                onCommentChange={this.handleCommentChange}
              />
              {comments.map((
                comment,
                i // Place holder for now
              ) => (
                  <Comment
                    key={i}
                    nominator={comment.commenter}
                    nominatorPic="https://i.kinja-img.com/gawker-media/image/upload/s--s1IAfVS_--/c_fill,f_auto,fl_progressive,g_center,h_675,q_80,w_1200/kaprfadz9rnvypesa2u9.png"
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
    if (this.state.hasBeenNominated) {
      this.makeUpvote();
    } else {
      this.removeUpvote();
    }
  };

  private handleCommentAdd = () => {
    alert(this.state.newComment);
    this.makeComment(this.state.newComment);
  };

  private makeUpvote = () => {
    const defaultDatabase = firebase.database();

    const user = getUser();
    const uid = user.profile.oid;

    const upvoter = {
      [uid]: true
    };

    const upvoterPath = defaultDatabase.ref('/nominations/' + this.props.nominationID + '/upvoters/');

    return upvoterPath.update(upvoter);
  }

  private removeUpvote = () => {
    const defaultDatabase = firebase.database();

    const user = getUser();
    const uid = user.profile.oid;

    const upvoterPath = defaultDatabase.ref('/nominations/' + this.props.nominationID + '/upvoters/' + uid);

    return upvoterPath.remove();
  }

  private makeComment = (userComment: string) => {
    const defaultDatabase = firebase.database();

    const newPostKey = defaultDatabase.ref().child('/nominations/' + this.props.nominationID + '/comments/').push().key;

    const user = getUser();

    const comment = {
      comment: userComment,
      commenter: user.profile.oid
    }
    const updates = {};
    updates['/nominations/' + this.props.nominationID + '/comments/' + newPostKey] = comment; 
    return defaultDatabase.ref().update(updates);
  }

  private handleCommentChange = (event: any) => {
    this.setState({ newComment: event.target.value });
  };
}

export default NominationModal;
