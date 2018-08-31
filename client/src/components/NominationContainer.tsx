import * as React from "react";

export interface INominationContainerProps {
  nominationID: string;
  open: boolean;
}

class NominationContainer extends React.Component<any, any> {
  public state = {
    nominationID: "",
    img: "",
    nominee: "",
    nominator: "",
    category: "",
    justification: "",
    upvoters: [] as any[],
    comments: [] as any[]
  };

  public static defaultProps = {
    isModal: true
  };

  public onClose = () => {
    this.props.history.goBack();
  };

  public componentDidMount() {
    // Get the nomination info and
  }

  public render() {
    return (
      <div
        className="modal"
        style={{
          display: "block",
          position: this.props.isModal ? "fixed" : "static"
        }}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Modal title</h5>

              {this.props.isModal && (
                <button
                  className="close"
                  onClick={this.props.onClose || this.onClose}
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              )}
            </div>

            <div className="modal-body">
              <p>Modal body</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default NominationContainer;
