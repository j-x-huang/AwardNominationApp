import * as React from "react";
import reactCSS from "reactcss";
import { BlockPicker } from "react-color";
import Octicon, { X } from "@githubprimer/octicons-react";

// export interface ICategoryTileProps {

// }

// export interface ICategoryTileState {

// }

class CategoryTile extends React.Component<any, any> {
  public state = {
    displayColorPicker: false,
    color: "#673AB7"
  };

  private handleClick = () => {
    this.setState({ displayColorPicker: !this.state.displayColorPicker });
  };

  private handleClose = () => {
    this.setState({ displayColorPicker: false });
  };

  private handleChange = (dColor: any) => {
    this.setState({ color: dColor.hex });
  };

  public render() {
    const styles = reactCSS({
      default: {
        color: {
          width: "1.5em",
          height: "1.5em",
          borderRadius: "2px",
          background: `${this.state.color}`,
          display: "inline-block",
          boxShadow: "0 0 0 1px rgba(0,0,0,.1)",
          cursor: "pointer"
        },
        popover: {
          position: "fixed",
          top: "50%",
          left: "50%",
          marginLeft: "-85px",
          marginTop: "-130px",
          zIndex: "2"
        },
        cover: {
          position: "fixed",
          top: "0px",
          right: "0px",
          bottom: "0px",
          left: "0px"
        }
      }
    });

    return (
      <div className="category-tile-wrapper div-centre">
        <div className="category-tile">
          <span>Being Purple</span>
          <div
            style={{
              float: "right",
              width: "1.5em",
              height: "1.5em"
            }}
          >
            <div style={styles.color} onClick={this.handleClick} />
            {this.state.displayColorPicker ? (
              <div style={styles.popover}>
                <div style={styles.cover} onClick={this.handleClose} />
                <BlockPicker
                  triangle="hide"
                  width="200"
                  colors={[
                    "#f44336",
                    "#e91e63",
                    "#9c27b0",
                    "#673ab7",
                    "#3f51b5"
                  ]}
                  color={this.state.color}
                  onChange={this.handleChange}
                />
              </div>
            ) : null}
          </div>
        </div>
        <button
          type="button"
          className="btn btn-light float-right btn-top-round"
        >
          <Octicon className="octigrey" size="small" icon={X} />
        </button>
      </div>
    );
  }
}

export default CategoryTile;
