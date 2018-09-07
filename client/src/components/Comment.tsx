import * as React from "react";

class Comment extends React.Component<any, any> {
  public render() {
    return (
      <div className="div-centre comment">
        <img
          className="profilePic"
          src="https://i.kinja-img.com/gawker-media/image/upload/s--s1IAfVS_--/c_fill,f_auto,fl_progressive,g_center,h_675,q_80,w_1200/kaprfadz9rnvypesa2u9.png"
        />
        <div className="comment-box">
          <span className="commenter">Yuan Wei</span>{" "}
          <span>Random comment passing by.</span>
        </div>
      </div>
    );
  }
}

export default Comment;
