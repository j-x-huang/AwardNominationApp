import * as React from "react";
import "../App.css";

class Admin extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
    }
    public state = {
        isLockDown: false
    }
    public render() {
        return (
            <div>
              <button
                type="button"
                className="btn btn-primary"
                onClick={this.lockDown}
              >
                Lock
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={this.filterTally}
              >
                Tally
              </button>
            </div>
        );
    }
    private lockDown = () => {
        this.state.isLockDown = !this.state.isLockDown;
        console.log('Lock down ' + this.state.isLockDown);
    };

    private filterTally = () => {
        console.log('I will filter and tally');
    };

}

export default Admin;