import * as React from "react";
import Octicon, { PlusSmall } from "@githubprimer/octicons-react";

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
          style={{ alignSelf: "flex-start" }}
          onClick={onCommentAdd}
        >
          <Octicon className="octigrey" size="medium" icon={PlusSmall} />
        </button>
      </div>
    );
  }
}

export default CommentAdder;
