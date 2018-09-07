import * as React from "react";
import Octicon, { ChevronLeft } from "@githubprimer/octicons-react";
import * as firebase from "firebase";
import { getUserDetails } from "../MicrosoftGraphClient";
import Comment from "./Comment";
import CommentAdder from "./CommentAdder";

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
    newComment: ""
  };

  public static defaultProps = {
    isModal: true
  };

  public onClose = () => {
    this.props.history.goBack();
  };

  public componentDidMount() {
    console.log("Modal mounted!");
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
    nomRef
      .child("nominations")
      .child(nominationID)
      .once("value", snapshot => {
        if (snapshot != null) {
          this.saveSnapshot(snapshot);
        }
      });
  }

  public saveSnapshot = (snapshot: firebase.database.DataSnapshot) => {
    const data = snapshot.val();
    this.setState({
      justification: data.justification,
      category: data.category
    });
    console.log(data.comments != null);
    if (data.comments != null) {
      this.setState({
        comments: data.comments
      });
    }
    if (data.upvoters != null) {
      this.setState({
        upvoters: data.upvoters
      });
    }
    console.log("State updated!");
    console.log(this.state);
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
    const { nominee, nominator, category, justification } = this.state;

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
        <div id="modal-dialog award-modal-back-container">
          {this.props.isModal && (
            <button
              type="button"
              className="btn btn-light btn-bold"
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
              <div>
                <img src={nominee.img} />
                <h1>{nominee.name}</h1>
                <p>category: {category}</p>
                <p>Nominated by: {nominator.name}</p>
                <img src={nominator.img} />
                <p>Justification: {justification}</p>
              </div>
              <p>{this.props.nominationID}</p>
              <CommentAdder
                comment={this.state.newComment}
                nominatorPic="https://galvanicmedia.files.wordpress.com/2018/02/screen-shot-2018-02-03-at-3-38-38-pm.png?w=672&h=372&crop=1"
                onCommentAdd={this.handleCommentAdd}
                onCommentChange={this.handleCommentChange}
              />
              <Comment
                nominator="David Qi"
                nominatorPic="https://i.kinja-img.com/gawker-media/image/upload/s--s1IAfVS_--/c_fill,f_auto,fl_progressive,g_center,h_675,q_80,w_1200/kaprfadz9rnvypesa2u9.png"
                comment="Random comment passing by"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  private handleCommentAdd = () => {
    alert(this.state.newComment);
  };

  private handleCommentChange = (event: any) => {
    this.setState({ newComment: event.target.value });
  };
}

export default NominationModal;
