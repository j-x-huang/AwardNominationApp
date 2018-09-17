import * as React from "react";
import Octicon, { PlusSmall } from "@githubprimer/octicons-react";
import * as firebase from "firebase";
export interface ICommentAdderProps {
  onCommentAdd: any;
  onCommentChange: any;
  comment: string;
  nominatorPic: string;
}

class CommentAdder extends React.Component<any, any> {
  public state = {
    isLocked: false
  }
  public componentDidMount() {
    this.readLockState();
  }
  public render() {
    const { comment, onCommentAdd, onCommentChange, nominatorPic } = this.props;

    return (
      <div className="div-centre" style={{ paddingBottom: "0.75em" }}>
        <img
          className="profilePic"
          style={{ alignSelf: "flex-start" }}
          src={nominatorPic}
        />
        <textarea
          style={{ resize: "none" }}
          className="textarea comment-box-add form-control"
          placeholder="Write a comment..."
          rows={2}
          value={comment}
          onChange={onCommentChange}
        />
        <button
          type="button"
          className="btn btn-light float-right btn-top-round"
          onClick={onCommentAdd}
          style={this.state.isLocked ? { display: 'none', alignSelf: "flex-start" } : {alignSelf: "flex-start"} }
        >
          <Octicon className="octigrey" size="medium" icon={PlusSmall} />
        </button>
      </div>
    );
  }
  private readLockState = () => {
    const defaultDatabase = firebase.database();
    const lockPath = defaultDatabase.ref("/lockdown");
    lockPath.once('value').then(value => {
        console.log(value.val().lockState);
        this.setState({ isLocked: value.val().lockState});
        return value.val().lockState;
    })
  }
}

export default CommentAdder;
