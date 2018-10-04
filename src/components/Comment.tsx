import * as React from "react";

export interface ICommentProps {
  nominator: string;
  nominatorPic: string;
  comment: string;
}

class Comment extends React.Component<ICommentProps, any> {
  public render() {
    const { comment, nominator, nominatorPic } = this.props;

    return (
      <div className="div-centre">
        <img className="profilePic" src={nominatorPic} />
        <div className="comment-box">
          <span className="commenter">{nominator}</span> <span>{comment}</span>
        </div>
      </div>
    );
  }
}

export default Comment;
