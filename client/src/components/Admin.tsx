import * as React from "react";
import "../App.css";

class Admin extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
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
        console.log('I will lock down');
    };

    private filterTally = () => {
        console.log('I will filter and tally');
    };

}

export default Admin;