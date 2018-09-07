import * as React from "react";
import Octicon, { MarkGithub } from "@githubprimer/octicons-react";

export interface ICommentAdderProps {
  onCommentAdd: any;
  onCommentChange: any;
  comment: string;
  nominatorPic: string;
}

class CommentAdder extends React.Component<any, any> {
  public render() {
    const { comment, onCommentAdd, onCommentChange, nominatorPic } = this.props;

    return (
      <div className="div-centre">
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
          className="btn btn-primary float-right btn-top-round"
          style={{ alignSelf: "flex-start" }}
          onClick={onCommentAdd}
        >
          <Octicon className="octiocti" size="small" icon={MarkGithub} />
        </button>
      </div>
    );
  }
}

export default CommentAdder;
